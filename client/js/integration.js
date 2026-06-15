import { loadAppConfig } from './appConfig';


export function createIntegration(query) {
  if (query.source && query.project_id && query.sample_id) {
    return new MosaicIntegration(query);
  }
  else {
    return new StandardIntegration(query);
  }
}


class Integration {
  constructor(query) {
    this.query = query || {};
  }

  initConfig() {
    return loadAppConfig()
    .then(appConfig => {
      this.appConfig = appConfig;
      return this.loadLaunchParams();
    })
    .then(launchParams => {
      // URL params have precedence over params loaded from ?config=...
      this.params = Object.assign({}, launchParams, this.query);
      this.backendUrl = this.getBackendUrl();
    });
  }

  loadLaunchParams() {
    if (!this.query.config) {
      return Promise.resolve({});
    }

    return fetch(this.query.config).then(response => response.json());
  }

  getBackendUrl() {
    const map = this.appConfig.backend_map || {};

    if (this.params.source) {
      const source = new URL(decodeURIComponent(this.params.source)).origin;
      let allowedBackend = map[source];

      // Allow source entries to point to a named backend entry, e.g.
      // "https://mosaic...": "mosaic".
      allowedBackend = map[allowedBackend] || allowedBackend;

      if (!allowedBackend) {
        throw new Error('Source is not allowed by backend_map: ' + source);
      }

      if (this.params.backend && this.params.backend !== allowedBackend) {
        throw new Error('Backend is not allowed for source ' + source + ': ' + this.params.backend);
      }

      return this.params.backend || allowedBackend;
    }

    const configuredBackend = getServiceUrl(this.appConfig, 'backend');

    if (this.params.backend) {
      if (this.params.backend === configuredBackend || this.params.backend === map.default) {
        return this.params.backend;
      }
      throw new Error('Backend is not allowed: ' + this.params.backend);
    }

    return configuredBackend || map.default;
  }
}

class StandardIntegration extends Integration {
  init() {
    return this.initConfig();
  }

  buildParams() {
    return Object.assign({
      backendUrl: this.backendUrl,
    }, this.params);
  }

  buildQuery() {
    return Object.assign({}, this.query);
  }
}

class MosaicIntegration extends Integration {

  init() {
    return this.initConfig().then(() => {
      return new Promise((resolve, reject) => {

        const projectId = this.params.project_id;

        if (projectId) {
          this.getMosaicIobioUrls((alignmentURL, alignmentIndexURL) => {
            this.alignmentURL = alignmentURL;
            this.alignmentIndexURL = alignmentIndexURL;
            resolve(alignmentURL, alignmentIndexURL);
          });
        }
      });
    });
  }

  buildParams() {
    return {
      bam: this.alignmentURL,
      bai: this.alignmentIndexURL,
      backendUrl: this.backendUrl,
      region: this.params.region,
    };
  }

  buildQuery() {
    return {
      source: this.params.source,
      sample_id: this.params.sample_id,
      project_id: this.params.project_id,
      sampling: this.params.sampling,
      region: this.params.region,
      backend: this.params.backend,
      experiment_id: this.params.experiment_id,
    };
  }

  getMosaicIobioUrls(callback) {
    let source = decodeURIComponent(this.params.source);
    let api = source + "/api/v1";

    let project_id = this.params.project_id;
    let access_token = this.params.access_token;
    let sample_id = this.params.sample_id;
    let token_type = this.params.token_type;
    let experiment_id = this.params.experiment_id;

    if (access_token !== undefined) {
      localStorage.setItem('hub-iobio-tkn', token_type + ' ' + access_token);
    }

    if (localStorage.getItem('hub-iobio-tkn')) {

      // Get VCF File
      getFilesForSample(sample_id, project_id).done(files => {
        var data = files.data.filter(file => {
          if(experiment_id){
            return file.experiment_ids.includes(Number(experiment_id))
          }
          else {
            return file
          }
        })
        const bam = data.filter(f => (f.type == 'bam' || f.type == 'cram'))[0];
        const bai = data.filter(f => (f.type == 'bai' || f.type == 'crai'))[0];

        // Get Signed Url
        getSignedUrlForFile(project_id, bam).done(bamUrlData => {
          const bamUrl = bamUrlData.url;
          getSignedUrlForFile(project_id, bai).done(baiUrlData => {
            const baiUrl = baiUrlData.url;
            callback(bamUrl, baiUrl);
          })
        })
      })
    } else {
      window.location.href = buildOauthLink();

    }

    function getFilesForSample(sample_id, project_id) {
      return $.ajax({
        url: api + '/projects/' + project_id + '/samples/' + sample_id + '/files',
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': localStorage.getItem('hub-iobio-tkn')
        }
      }).fail(function(xhr,status,error) {
        let link = buildOauthLink();
        $('#warning-authorize')
          .append('Your access to hub.iobio has expired. Please click <a href='+link+'>here</a> to renew your access.')
          .css('display', 'block');
      });
    }

    function getSignedUrlForFile (project_id, file) {
      return $.ajax({
        // url: api + '/files/' + file.id + '/url',
        url: api + '/projects/' + project_id + '/files/' + file.id + '/url',
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': localStorage.getItem('hub-iobio-tkn')
        }
      });
    }

    function buildOauthLink() {
      const link = new URL('/oauth/authorize', source);
      link.searchParams.set('redirect_uri', window.location.href);
      return link.toString();
    }
  }
}

function getServiceUrl(config, name) {
  const service = config[name] || {};
  const origin = service.origin || config.origin || window.location.origin;

  if (!service.path) {
    return '';
  }

  return (origin + service.path).replace(/\/+$/, '');
}

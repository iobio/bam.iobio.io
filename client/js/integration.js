export function createIntegration(query) {
  if (query.source) {
    return new MosaicIntegration(query);
  }
  else {
    return new StandardIntegration(query);
  }
}


class Integration {
  constructor(query) {

    this.query = query;
  }
}

class StandardIntegration extends Integration {
  init() {

    return new Promise((resolve, reject) => {
      this.alignmentURL = this.query.bam;
      this.alignmentIndexURL = this.query.bai;
      resolve();
    });
  }

  buildParams() {
    return Object.assign({
      backendSource: 'nv-prod.iobio.io',
    }, this.query);
  }

  buildQuery() {
    return Object.assign({
      bam: this.alignmentURL,
      bai: this.alignmentIndexURL,
    }, this.query);
  }
}

class MosaicIntegration extends Integration {

  init() {
    this.hubToIobioSources = {
      "https://mosaic.chpc.utah.edu":         "mosaic.chpc.utah.edu",
      "https://mosaic-dev.genetics.utah.edu": "mosaic.chpc.utah.edu",
      "http://mosaic-dev.genetics.utah.edu":  "mosaic.chpc.utah.edu",
      "https://staging.frameshift.io":        "nv-prod.iobio.io",
    };

    return new Promise((resolve, reject) => {
      const projectId = this.query.project_id;

      if (projectId) {
        this.getMosaicIobioUrls((alignmentURL, alignmentIndexURL) => {
          this.alignmentURL = alignmentURL;
          this.alignmentIndexURL = alignmentIndexURL;
          resolve(alignmentURL, alignmentIndexURL);
        });
      }
    });
  }

  buildParams() {
    return {
      bam: this.alignmentURL,
      bai: this.alignmentIndexURL,
      backendSource: this.hubToIobioSources[this.query.source],
    };
  }

  buildQuery() {
    return {
      source: this.query.source, 
      sample_id: this.query.sample_id,
      project_id: this.query.project_id,
      sampling: this.query.sampling,
      region: this.query.region,
    };
  }

  getMosaicIobioUrls(callback) {
    let api = decodeURIComponent(this.query.source) + "/apiv1";

    let project_id = this.query.project_id;
    let access_token = this.query.access_token;
    let sample_id = this.query.sample_id;
    let token_type = this.query.token_type;

    if (access_token !== undefined) {
      localStorage.setItem('hub-iobio-tkn', token_type + ' ' + access_token);
    }

    if (localStorage.getItem('hub-iobio-tkn')) {

    // Get VCF File
      getFilesForSample(sample_id).done(data => {
        const bam = data.data.filter(f => (f.type == 'bam' || f.type == 'cram'))[0];
        const bai = data.data.filter(f => (f.type == 'bai' || f.type == 'crai'))[0];

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

    function getFilesForSample(sample_id) {
      return $.ajax({
        url: api + '/samples/' + sample_id + '/files',
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
  }
}

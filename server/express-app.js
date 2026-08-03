var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var history = require('connect-history-api-fallback');

var clientDir = path.join(__dirname, '..', 'client');
var config = {};

try {
  config = JSON.parse(fs.readFileSync(path.join(clientDir, 'config.json'), 'utf8'));
}
catch (e) {}

var appPath = config.bam && config.bam.path_prefix || '/';
var mountPath = appPath === '/' ? '/' : appPath.replace(/\/+$/, '');

if (mountPath === '/') {
  app.use(history());
  app.use(express.static(clientDir));
}
else {
  app.get(mountPath, function(req, res) {
    var queryIndex = req.originalUrl.indexOf('?');
    var query = queryIndex === -1 ? '' : req.originalUrl.slice(queryIndex);
    res.redirect(301, mountPath + '/' + query);
  });

  app.use(mountPath, history({ index: '/index.html' }));
  app.use(mountPath, express.static(clientDir));

  app.get('/', function(req, res) {
    res.redirect(302, mountPath + '/');
  });
}

module.exports = app;

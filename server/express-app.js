var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
var path = require('path');
var history = require('connect-history-api-fallback');

app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(history());

module.exports = app;

"use strict";

var path = require('path');
var express = require('express');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/forecast', (function(){
	let API = require('../index');
	let forecastKey = require('../config/keys').forecast;
	let forecast = new API(forecastKey, {units: 'si'});

	return function(req, res){
		const lat = req.query.lat;
		const lng = req.query.lng;
		delete req.query.lat;
		delete req.query.lng;

		forecast.get(lat, lng, req.query).then(html => {
			res.render('index', {forecast: html});
		});
	}
})());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log(err)
  next(err);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});

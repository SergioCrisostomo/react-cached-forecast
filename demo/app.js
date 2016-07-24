'use strict';

console.log('Server start called');

var path = require('path');
var express = require('express');
var app = express();

const PORT = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', PORT);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (function(){
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

app.locals.pretty = true;
app.use(function(err, req, res, next) {
	console.log(err.message);
	console.log(err);
	res.status(err.status || 500);
	res.end(err.message);
});

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});

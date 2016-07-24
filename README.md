# React weather forecast with caching

**Weather forecast app based on React and with server caching to minimize forecast API calls.**

The app takes arguments like _latitude_, _longitude_, _language_, _units_, and other parameters from the [ForecastIO API](https://developer.forecast.io/docs/v2) and returns a HTML string with the weather forecast for the region like:

![](https://cdn.pbrd.co/images/aLimwU7W.png)

### [Demo here](https://goo.gl/hEf2MF)

### Usage example

Server side code:

	let API = require('react-cached-forecast');
	let forecastKey = require('../config/keys'); // or where you have the keys
	let forecast = new API(forecastKey, {units: 'si'});


	app.get('/', function(req, res){
		const lat = req.query.lat;
		const lng = req.query.lng;
		const options = {lang: 'sv'};

		forecast.get(lat, lng, options).then(html => {
			res.send(html);
		});
	});

In the client I'm using [Skycons](https://darkskyapp.github.io/skycons/) for the animations. Check [the demo](https://goo.gl/hEf2MF) or [open a issue](https://github.com/SergioCrisostomo/react-cached-forecast/issues/new) if you have questions.

### App defaults

Units default to `si` (european), check the [Forecast docs](https://developer.forecast.io/docs/v2#options) for other units.

Language defaults to `en`.   
Place name defaults to _Timezone_ region. Otherwise set `placeName` in the options.

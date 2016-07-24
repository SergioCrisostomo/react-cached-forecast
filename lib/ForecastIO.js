'use strict';

var jsx = require('node-jsx');
jsx.install();
const req = require('request');
const React = require('react');
const ReactForecast = require('./ForecastComponent.jsx');

// makes objects into query string
const toQueryString = (obj) => {
    return Object.keys(obj).map(key => {
        return [key, obj[key]].join('=');
    }).join('&');
}

// merge options
const merge = (defaults, localOptions) => {
    let opts = JSON.parse(JSON.stringify(defaults));
	if (!localOptions) localOptions = {};

	// remove module private keys
	['timeout'].forEach(prop => { delete opts[prop];});

    for (var key in localOptions) {
        opts[key] = localOptions[key];
    }
    return opts;
}

class ForecastIO {
    constructor(apiKey, options) {
        this.apiKey = apiKey;
        this.options = options || {};
        this.options.timeout = options.timeout || 3 * 60 * 60 * 1000; // defaults to 3 hours
        this.places = {};
        this.update();
    }

    update() {
        let now = new Date().getTime();
        let updatePlaces = Object.keys(this.places).filter(p => p.expire > now);
        let fetchers = updatePlaces.map(obj => {
            return this.queryAPI(obj.lat, obj.lng, obj.options);
        });
        Promise.all(fetchers).then(bodies => {
            setTimeout(this.update, this.options.timeout);
        });
    }

    save(lat, lng, options, body) {
        let lifetime = options.lifetime || this.options.timeout;
        let expireDate = new Date().getTime() + lifetime;
        let key = this.generateKey(lat, lng, options);
        this.places[key] = {
            expire: expireDate,
            options: options,
            body: body
        };
    }

    generateReqUrl(lat, lng, opts) {
        let root = `https://api.forecast.io/forecast/${this.apiKey}/${lat},${lng}`;
		let options = merge(this.options, opts);
        let queryString = toQueryString(options);
        return [root, queryString].join('?');
    }

    generateKey(lat, lng, options) {
        return [lat, lng, JSON.stringify(options)].join('~');
    }

    queryAPI(lat, lng, options) {
        return new Promise((resolve, reject) => {

            let url = this.generateReqUrl(lat, lng, options);
            req(url, (err, res, body) => {
				let json = JSON.parse(body);

                if (res.statusCode !== 200 || err) {
                    reject(`Script Error: ${err} \nAPI Response: ${res.statusCode} :: ${res.statusMessage}`);
                } else {
                    this.save(lat, lng, options, json);
                }
                resolve(json);
            });
        });
    }

    get(lat, lng, opts) {
        let options = merge(this.options, opts);
        let key = this.generateKey(lat, lng, options);

		let _json = this.places[key] ?
			this.places[key].body :
			this.queryAPI(lat, lng, options);

        return new Promise((resolve, reject) => {
			Promise.resolve(_json).then(json => {
				resolve(ReactForecast(json, opts));
			});
		});

    }
}

module.exports = ForecastIO;

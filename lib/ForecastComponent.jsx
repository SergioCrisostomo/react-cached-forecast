const React = require('react');
const ReactDOMServer = require('react-dom/server');
const text = require('../assets/lang');
const units = require('../assets/units');

const addUnits = (nr, unit, type) => {
	let standard = units[unit];
	return [nr.toFixed(standard.decimal), standard[type]].join(' ');
}

class WeekDayLayout extends React.Component {

	getDateString(date){
		if (!date) date = new Date();
		return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
	}

	render(){
		let dayData = this.props.dayData;
		let date = new Date(dayData.time * 1000);
		let today = this.getDateString();
		let isToday = today == this.getDateString(date);
		let lang = this.props.lang;
		let dayLabel = isToday ? text.today[lang] : text.weekDays[lang][date.getDay()];

		let unit = this.props.units;
		let max = addUnits(dayData.temperatureMax, unit, 'temperature');
		let min = addUnits(dayData.temperatureMin, unit, 'temperature');

		return (
			<div className='fe_day'>
				<span className='fe_label'>{dayLabel}</span>
				<canvas width='52' height='52' data-icon={dayData.icon} className='fe_icon' />
				<span className='fe_high_temp'>{max}</span>
				<span className='fe_low_temp'>{min}</span>
			</div>
		);
	}
}

class Title extends React.Component {

	getPlaceName(props){
		let timezone = (tz => {
			return tz[1] && tz[1].split('_').join(' ')
		})(props.timezone.split('/'));
		return props.placeName || timezone;
	}

	render(){
		let legend = text.weatherIn[this.props.lang];
		return (
			<div className='fe_title'>
				<span className='fe_location'>
					<span className='desc'>{legend} </span>
					<span className='placeName'>{this.getPlaceName(this.props)}</span>
				</span>
			</div>
		);
	}
}

class Forecast extends React.Component {

	render() {

		let today = this.props.json.currently;
		let lang = this.props.opts.lang;
		let unit = this.props.opts.units;
		let placeName = this.props.opts.placeName;

		let days = this.props.json.daily.data.map((dayData, i) => {
			return (<WeekDayLayout key={i} units={unit} dayData={dayData} lang={lang}/>);
		});

		let temperature = addUnits(today.temperature, unit, 'temperature');
		let wind = [text.wind[lang], addUnits(today.windSpeed, unit, 'speed')].join(' ');

		return (
			<div id='forecast_embed' className='fe_container'>
				<Title placeName={this.props.opts.placeName} lang={lang} timezone={this.props.json.timezone}/>
                <div className='fe_forecast'>
                    <div className='fe_currently'>
                        <canvas width='80' height='80' id='fe_current_icon' data-icon={today.icon}/>
                        <div className='fe_temp'>{temperature}
							<span className='fe_dir' />
						</div>
                        <div className='fe_summary' />
                        <div className='fe_wind'>{wind}</div>
                    </div>
                    <div className='fe_daily'>
                        <div className='fe_day'><span className='fe_label' />
                            <canvas className='fe_icon' />
                            <span className='fe_high_temp'>Max:</span>
                            <span className='fe_low_temp'>Min:</span>
                        </div>
						{days}
                    </div>
                    <div style={{clear: 'left'}} />
                </div>
            </div>
		);
	}
}

module.exports = function(json, options){

	// check some defaults
	if (!options.units) options.units ='si';
	if (!options.lang) options.lang ='en';

	return ReactDOMServer.renderToString(<Forecast json={json} opts={options} />);
};

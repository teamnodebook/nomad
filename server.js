'user strict';
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const path = require('path');
const _ = require('underscore');
const app = express();

const pool = require('./db/postgresConnect.js');

const port = process.env.PORT || 5000; // port

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, '/client'))); // static files

app.get('/api/getEvent', (req,res) =>{

	// const sampleEvent = {
	// 										radius: 1,
	// 										long: -2.136357735948972,
	// 										lat: 0.659570546402485
	// 									}
	// new Promise((resolve, reject) =>{
	// 	pool.connect(function(err, client, done) {
	// 	  if(err) {
	// 	  	reject(err);
	// 	  }
	// 	  resolve(client);
	// 	});
	// }).then((client) => {
	// 	client.query(`select name, host, description, lat, long, start_date, end_date 
	// 								from public.events inner join public.dates on public.dates.fk_event = public.events.id
	// 								where acos(sin(${sampleEvent.lat}) * sin(public.events.lat) + 
	// 								cos(${sampleEvent.lat}) * cos(public.events.lat) * 
	// 								cos(public.events.long - (${sampleEvent.long}))) * 6371 <= ${sampleEvent.radius}`, 
	// 								(err, result)=>{
	// 									console.log(err, 'check error');
	// 									console.log(result.rows, 'result from getEvent');
	// 									const events = {
	// 										events: result.rows
	// 									}
	// 									res.send(events).end();
	// 								}
	// 	);
	// });

//join events with dates where event id = foreign key id
//where long and lat are like

//select * from events where lat < `${longRange}` and long < `${latRange}`
});

app.post('/api/createEvent', (req, res) =>{
	// var sampleObj = [{
	// 									info: {
	// 										name: 'Rap battle',
	// 										host: 'Jemil',
	// 										description: 'Lets battle'
	// 									},
	// 									location: {
	// 										lat: 37.773972,
	// 										long: -122.431297
	// 									},
	// 									time: [
	// 										{start: '2016-10-14T21:43:22.809Z',
	// 											end: '2016-10-14T23:43:22.809Z'},
	// 										{start: '2016-11-14T21:43:22.809Z',
	// 											end: '2016-11-14T23:43:22.809Z'}
	// 									]
	// 								},
	//								{same as above object} 
	// 								]

	// let insertTimes = (client) =>{
	// 	_.each(sampleObj.time, (time) =>{
	// 		client.query(`insert into public.dates
	// 								(start_date, end_date, fk_event)
	// 								values ('${time.start}',
	// 								'${time.end}',
	// 								(select id from public.events where name='${sampleObj.info.name}' and lat=${sampleObj.location.lat} and long=${sampleObj.location.long}))`,
	// 								(err, result) =>{
	// 									console.log(err, 'check error')
	// 									console.log(result, ' result from insert statement')
	//									res.send('Success').end();
	// 								});
	// 	});
	// };

	// // insert into public.events (name, host, description, lat, long) values(,,,,,,);
	// new Promise((resolve, reject) =>{
	// 	pool.connect(function(err, client, done) {
	// 	  if(err) {
	// 	  	reject(err);
	// 	  }
	// 	  resolve(client);
	// 	});
	// }).then((client) =>{
	// 	client.query(`insert into public.events
	// 								(name, host, description, lat, long)
	// 								values ('${sampleObj.info.name}',
	// 								'${sampleObj.info.host}',
	// 								'${sampleObj.info.description}',
	// 								${sampleObj.location.lat},
	// 								${sampleObj.location.long})`,
	// 							(err, result) =>{
	// 								console.log(err, 'check error')
	// 								console.log(result, ' result from insert statement')
	// 								insertTimes(client);
	// 							});
	// });

});

app.listen(port, () =>{
	// listening
	console.log('Nomad Wandering on: ', port);
});

// posting an event has a request body like so
	/*
	{
		info: {
			name:,
			host:,
			description:
		},
		location: {
			lat:,
			long:
		}
		time:[
			{start:, end:} // ISO FROMAT
		]
	}
	*/

/*
	function to help make seed data
	
	var latlong = function(lat, long) {
		var latRad = lat.toRad();
		var longRad = long.toRad();
		return `${latRad}, ${longRad}`;
	}
	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	}
*/
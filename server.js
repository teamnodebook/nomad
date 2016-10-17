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
app.use(express.static(path.join(__dirname, 'src/client/public/'))); // static files

// turn lat and long into radians
Number.prototype.toRad = function() {
	return this * Math.PI / 180;
};

app.post('/api/createEvent', (req, res) =>{
	// var sampleObj = {
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
	// 								};

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
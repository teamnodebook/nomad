const pool = require('./postgresConnect.js');

const sampleData = [{info: {
					name: 'Rap battle',
					host: 'Jemil',
					description: 'Lets battle'
				},
				location: {
					lat: 37.773972,
					long: -122.431297
				},
				time: [
					{start: '2016-10-14T21:43:22.809Z',
						end: '2016-10-14T23:43:22.809Z'},
					{start: '2016-11-14T21:43:22.809Z',
						end: '2016-11-14T23:43:22.809Z'}
				]}, 
				{info: {
					name: 'Dance battle',
					host: 'Alex',
					description: 'Lets battle'
				},
				location: {
					lat: 38.773972,
					long: -121.431297
				},
				time: [
					{start: '2016-11-14T21:43:22.809Z',
						end: '2016-11-14T23:43:22.809Z'},
					{start: '2016-12-14T21:43:22.809Z',
						end: '2016-12-14T23:43:22.809Z'}
				]}];	

new Promise((resolve, reject) =>{
	pool.connect(function(err, client, done) {
	  if(err) {
	  	reject(err);
	  }
	  resolve(client);
	});
}).then((client) =>{
	//drop tables (don't drop until I can seed first)
	client.query('', (err, result) =>{
								console.log(err, 'check error')
								console.log(result, ' result from insert statement')
							});	
	}
).then((client) =>{
	// Create tables (look at schema in Schema.sql)	
	client.query('',
		// `create table events(
		// 	id serial,
		// 	name varchar,
		// 	host varchar,
		// 	description varchar,
		// 	lat decimal,
		// 	long decimal,
		// 	Primary key (id)
		// );

		// create table dates(
		// 	id serial,
		// 	start_date varchar,
		// 	end_date varchar,
		// 	fk_event int,
		// 	primary key (id),
		// 	foreign key (fk_event) references public.events(id) 
		// );`, 
			(err, result) =>{
								console.log(err, 'check error')
								console.log(result, ' result from insert statement')
							});
	}		
).then((client) =>{	
	// seed db: iterate through dummy events in an array and insert each event into events tables
    // in callback of insert statement call 
    //insert times function which iterates over 
    //time property array inside dummy data object		
	
	let insertTimes = (client) =>{
		_.each(sampleData.time, (time) =>{
			client.query(`insert into public.dates
									(start_date, end_date, fk_event)
									values ('${time.start}',
									'${time.end}',
									(select id from public.events where name='${sampleData.info.name}' and lat=${sampleData.location.lat} and long=${sampleData.location.long}))`,
									(err, result) =>{
										console.log(err, 'check error')
										console.log(result, ' result from insert statement')
									});
		});
	}; 
	_.each(sampleData, (obj) =>{
	client.query(`insert into public.events
									(name, host, description, lat, long)
									values ('${obj.info.name}',
									'${obj.info.host}',
									'${obj.info.description}',
									${obj.location.lat},
									${obj.location.long})`,
								(err, result) =>{
									console.log(err, 'check error')
									console.log(result, ' result from insert statement')
									insertTimes(client);
								});
	})
});

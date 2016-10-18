const pool = require('./postgresConnect.js');
const _ = require('underscore');

const data = require('../data.json');

new Promise((resolve, reject) =>{
	pool.connect(function(err, client, done) {
	  if(err) {
	  	reject(err);
	  }
	  console.log('we have a client and are ready to query');
	  client.query('drop table public.events, public.dates', 
	  						(err, result) =>{
									//console.log(err, 'check error drop table')
									//console.log(result, ' result from insert statement')
								});
	  resolve(client);
	});
}).then((client) =>{
	// Create tables (look at schema in Schema.sql)	
	client.query(
		`create table public.events(
			id serial,
			name varchar,
			host varchar,
			description varchar,
			lat decimal,
			long decimal,
			Primary key (id)
		);

		create table public.dates(
			id serial,
			start_date varchar,
			end_date varchar,
			fk_event int,
			primary key (id),
			foreign key (fk_event) references public.events(id) 
		);`, 
			(err, result) =>{
				console.log(err, 'check error create table')
				console.log(result, ' result from insert statement create table')

				let insertTimes = (client, obj) =>{
					_.each(obj.time, (time) =>{
						client.query(`insert into public.dates
												(start_date, end_date, fk_event)
												values ('${time.start}',
												'${time.end}',
												(select id from public.events where name='${obj.info.name}' and lat=${obj.location.lat} and long=${obj.location.long}))`,
												(err, result) =>{
													console.log(err, 'check error insert times')
													console.log(result, ' result from insert statement insert times')
												});
					});
				}; 

				_.each(data, (obj) =>{
				client.query(`insert into public.events
												(name, host, description, lat, long)
												values ('${obj.info.name}',
												'${obj.info.host}',
												'${obj.info.description}',
												${obj.location.lat},
												${obj.location.long})`,
											(err, result) =>{
												console.log(err, 'check error insert event')
												console.log(result, ' result from insert statement insert event')
												insertTimes(client, obj);
											});
				});
			});
});
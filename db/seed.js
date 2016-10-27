"use strict";

const pool = require('./postgresConnect.js');
const _ = require('underscore');

const data = require('../data.json');

//=========================== OLD VERSION ====================================
// const cp = new Promise((resolve, reject) =>{
// 	pool.connect(function(err, client, done) {
// 	  if(err) {
// 	  	reject(err);
// 	  }
// 	  console.log('we have a client and are ready to query');
// 	  resolve(client);
// 	});
// });

// cp.then((client) => {
//   client.query('drop table public.events, public.dates', 
// 						(err, result) =>{
// 							console.log(err, 'check error drop table')
// 							console.log(result, ' result from insert statement')
// 						});
// 	});

// cp.then((client) =>{	
// 	// Create tables (look at schema in Schema.sql)	
// 	client.query(
// 		`create table public.events(
// 			id serial,
// 			name varchar,
// 			host varchar,
// 			description varchar,
// 			lat decimal,
// 			long decimal,
// 			Primary key (id)
// 		);

// 		create table public.dates(
// 			id serial,
// 			start_date varchar,
// 			end_date varchar,
// 			fk_event int,
// 			primary key (id),
// 			foreign key (fk_event) references public.events(id) 
// 		);`, 
// 			(err, result) =>{
// 				console.log(err, 'check error create table')
// 				console.log(result, ' result from insert statement create table')				
// 			});
// })

// cp.then((client) =>{
// 	let insertTimes = (client, obj) =>{
// 		_.each(obj.time, (time) =>{
// 			client.query(`insert into public.dates
// 									(start_date, end_date, fk_event)
// 									values ('${time.start}',
// 									'${time.end}',
// 									(select id from public.events where name='${obj.info.name.replace(/(')/g, '\"')}' and lat=${obj.location.lat} and long=${obj.location.long}))`,
// 									(err, result) =>{
// 										console.log(err, 'check error insert times')
// 										console.log(result, ' result from insert statement insert times')
// 									});
// 		});
// 	}; 

// 	_.each(data, (obj) =>{
// 		client.query(`insert into public.events
// 										(name, host, description, lat, long)
// 										values ('${obj.info.name.replace(/(')/g, '\"')}',
// 										'${obj.info.host.replace(/(')/g, '\"')}}',
// 										'${obj.info.description.replace(/(')/g, '\"')}',
// 										${obj.location.lat},
// 										${obj.location.long})`,
// 									(err, result) =>{
// 										console.log(obj.info.name)
// 										console.log(err, 'check error insert event')
// 										console.log(result, ' result from insert statement insert event')
// 										insertTimes(client, obj);
// 										return;
// 									});
// 	});
// });


//=========================== REFACTORED VERSION ====================================
// const dropTableQuery = (clientInstance) => {
//   clientInstance.query('drop table public.events, public.dates');
// };

const createTablesQuery = (clientInstance) => {
	clientInstance.query(
		`create table public.events(
			id serial,
			name varchar,
			host varchar,
			description varchar,
			lat decimal,
			long decimal,
			paypal varchar,
			Primary key (id)
		);

		create table public.dates(
			id serial,
			start_date varchar,
			end_date varchar,
			fk_event int,
			primary key (id),
			foreign key (fk_event) references public.events(id) 
		);

		create table public.users(
			id serial,
			userevent int,
			username varchar,
			name varchar,
			email varchar,
			password varchar,
			primary key(id),
			foreign key (userevent) references public.events(id)
		);`)
};

const seedTablesQuery = (clientInstance) => {
	let insertTimes = (clientInstance, obj) => {
		_.each(obj.time, (time) => {
							clientInstance.query(`insert into public.dates
													(start_date, end_date, fk_event)
													values ('${time.start}',
													'${time.end}',
													(select id from public.events where name='${obj.info.name.replace(/(')/g, '\"')}' and lat=${obj.location.lat} and long=${obj.location.long}))`)
		});
	}; 
	_.each(data, (obj) => {
		clientInstance.query(`insert into public.events
										(name, host, description, paypal, lat, long)
										values ('${obj.info.name.replace(/(')/g, '\"')}',
										'${obj.info.host.replace(/(')/g, '\"')}',
										'${obj.info.description.replace(/(')/g, '\"')}',
										'${obj.info.paypal}',
										${obj.location.lat},
										${obj.location.long})`).then(insertTimes(clientInstance, obj))
								
	});
	_.each(data, (obj) => {
		clientInstance.query(`insert into public.users
										(username, name, email, password, userevent)
										values ('${obj.userinfo.username}',
										'${obj.userinfo.name}',
										'${obj.userinfo.email}',
										'${obj.userinfo.password}',
										(select id from public.events where name='${obj.info.name.replace(/(')/g, '\"')}' and lat=${obj.location.lat} and long=${obj.location.long}))`).then(insertTimes(clientInstance, obj))							
	});	

};

new Promise((resolve, reject) =>{
	pool.connect(function(err, client, done) {
	  if(client){
	  	resolve(client);
	  } else {
	  	reject(err)
	  }	  
	});
}).then((client) => {
	// dropTableQuery(client);
	createTablesQuery(client);
	seedTablesQuery(client);
}).catch((err) => {
	console.log("catch error: ", err);
});


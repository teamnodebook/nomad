// db name = aqua
// require('dotenv').config();
const pg = require('pg');

const config = {
  user: process.env.DB_USER, 
  database: process.env.DB_NAME, 
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: 5432, 
  ssl: true 
};

const pool = new pg.Pool(config);

module.exports = pool;

// create table events(
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
// );

/* SAMPLE QUERY FOR DATABSE */

// promise based

// new Promise(function(resolve, reject) {
// 	pool.connect(function(err, client, done) {
// 	  if(err) {
// 	  	reject(err);
// 	  }
// 	  resolve(client);
// 	});
// }).then(function(client) {
// 	client.query("select * from public.dates "+ 
//   							"where fk_event = ("+
//   							"select id from public.events "+ 
//   							"where host = 'Melba')", 
//   							function(err, result) {
							 
// 							    if(err) {
// 							      return console.error('error running query', err);
// 							    }
// 							    console.log(result.rows, ' do we have rows from our query');
// 							    //output: 1 
// 							  });
// });

// non promise based 

// pool.connect(function(err, client, done) {
//   if(err) {
//     return console.error('error fetching client from pool', err);
//   }
//   client.query("select * from public.dates "+ 
//   							"where fk_event = ("+
//   							"select id from public.events "+ 
//   							"where host = 'Melba')", 
//   							function(err, result) {
// 							    //call `done()` to release the client back to the pool 
// 							    done();
							 
// 							    if(err) {
// 							      return console.error('error running query', err);
// 							    }
// 							    console.log(result.rows, ' do we have rows from our query');
// 							    //output: 1 
// 							  });
// });
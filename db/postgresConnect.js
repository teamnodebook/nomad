// db name = aqua
if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config(); //comment out before push
}

const pg = require('pg');

const config = {
  user: 'pusakwcqcmnflu',
  database: 'd8u564vucg6odv',
  password: '8AMCLwF7uYBZ149XB2We5oT0Kg',
  host: 'ec2-54-225-101-191.compute-1.amazonaws.com',
  port: 5432,
  ssl: true
};
const pool = new pg.Pool(config);

module.exports = pool;

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
// 							    done()
// 							    if(err) {
// 							      return console.error('error running query', err);
// 							    }
// 							    console.log(result.rows, ' do we have rows from our query');
// 							    //output: 1
// 							  });
// });

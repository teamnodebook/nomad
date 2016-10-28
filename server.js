'use strict';
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const passport = require('passport');
const session = require('express-session');
const upload = multer();
const path = require('path');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
const _ = require('underscore');
const dateFormat = require('dateformat');
const app = express();


const pool = require('./db/postgresConnect.js'); //database

const port = process.env.PORT || 5000; // port

Number.prototype.toRad = function() {
	return this * Math.PI / 180;
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, '/client'))); // static files
// -> Passport Middleware Setup <- //
app.use(session({secret: 'mySecretKey'})); //session secret key
app.use(passport.initialize()); //initialize passport
app.use(passport.session()); // initialize session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  console.log(user.u_id +" was seralized");
  done(null, user.u_id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  console.log(id + "is deserialized");
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true 
  },

  function(req, email, password, done){
  	// query based on the email

  	var isValidPassword = function(user, password){
      return bcrypt.compare(password, user.password, function(err, res){
      	if(err){
      		return false
      	} 
      	return true;
      });
    }

  	pool.query('SELECT * from public.users where email=$1', [email], function(err, results){
  	  if(err){
  	  	console.log(err);
  	  	return done(err);
  	  }

  	  if(results.rows.length === 0){
  	  	console.log('User Not Found with username '+ email);
          return done(null, false, 
                req.flash('message', 'User Not found.'));
  	  }

  	  if(!isValidPassword(results.rows[0], password)){
  	  	console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
  	  }
  	  return done(null, user);
  	})
  }

));

app.post('/api/getEvent', (req,res) =>{

	//data is an array
	const structure = (data) =>{
 		let newData = data;
 		
 		let times = _.reduce(data, (final, event) =>{
 			final = final || {};
 			const key = `${event.lat},${event.long},${event.name}` 			
 			//format times to human readable
 			const newStart = dateFormat(new Date(event.start_date), "mmm dS, yy, h:MM TT")
 			const newEnd = dateFormat(new Date(event.end_date), "mmm dS, yy, h:MM TT")

 			const timeObj = {
				start: newStart, 
				end: newEnd
			};
 			
 			if(final[key] === undefined){
 				final[key] = {check: false};
 				// console.log(new Date(event.start_date), new Date(event.end_date));
 				final[key].times = [timeObj];
 			}else{
 				final[key].times.push(timeObj);
 			}

 			return final;
 		}, {});
 
		let count = 1;

 		return _.chain(newData).map((event) =>{
 			const key = `${event.lat},${event.long},${event.name}`;
 			
 			if(times[key].check === false){
 				event.time = times[key].times;
 				times[key].check = true;
 				delete event.start_date;
 				delete event.end_date;
 			}

 			return event; 
 		}).filter((event) =>{
 			return event.time !== undefined || null;
 		}).map((event) =>{

 			if(count % 2 === 0){
 				event.other = 'color';
 			}else{
 				event.other = 'notcolor';
 			}

 			count++;

 			return event;
 		});
 	};

	new Promise((resolve, reject) =>{
		pool.connect(function(err, client, done) {
		  if(err) {
		  	reject(err);
		  }
		  resolve(client);
		});
	}).then((client) => {
		client.query(`select public.events.id, name, host, description, paypal, lat, long, start_date, end_date
									from public.events inner join public.dates on public.dates.fk_event = public.events.id
									where acos(sin(${req.body.lat}) * sin(public.events.lat) +
									cos(${req.body.lat}) * cos(public.events.lat) *
									cos(public.events.long - (${req.body.long}))) * 6371 <= ${req.body.radius} and 
									to_timestamp(public.dates.start_date, 'YYYY-MM-DD') >= now() order by public.events.id;`,
									(err, result)=>{
										console.log(err, 'check error');
										// console.log(result.rows, 'result from getEvent');
										const events = {
											events: structure(result.rows)
										};
										console.log('HERE ARE YOUR EVENTS YOU FUCK:', JSON.stringify(events.events, null, 3));
										res.send(events).end();
									}
		);
	});

//join events with dates where event id = foreign key id
//where long and lat are like

//select * from events where lat < `${longRange}` and long < `${latRange}`
});

app.post('/api/createEvent', (req, res) =>{
	console.log(JSON.stringify(req.body, null, 3));
	//turn lat and long into radians
	req.body.location.lat = req.body.location.lat.toRad();
	req.body.location.long = req.body.location.long.toRad();

	console.log(req.body)

	let insertTimes = (client, cb) =>{
		_.each(req.body.time, (time) =>{
			console.log(req.body.info.name, req.body.info.location)
			client.query(`insert into public.dates
									(start_date, end_date, fk_event)
									values ('${time.start}',
									'${time.end}',
									(select id from public.events where name='${req.body.info.name}' and lat=${req.body.location.lat} and long=${req.body.location.long}))`,
									(err, result) =>{
										console.log(err, 'check error')
										console.log(result, ' result from insert statement')
									}
			);
		});
		cb();
	};

	// insert into public.events (name, host, description, lat, long) values(,,,,,,);
	new Promise((resolve, reject) =>{
		pool.connect(function(err, client, done) {
		  if(err) {
		  	reject(err);
		  }
		  resolve(client);
		});
	}).then((client) =>{
		client.query(`insert into public.events
									(name, host, description, paypal, lat, long)
									values ('${req.body.info.name}',
									'${req.body.info.host}',
									'${req.body.info.description}',
									'${req.body.info.paypal}',
									${req.body.location.lat},
									${req.body.location.long})`,
								(err, result) =>{
									console.log(err, 'check error')
									console.log(result, ' result from insert statement')
									insertTimes(client, () => {
										res.send();
									});
								}
		);
	});
});

app.post('/api/createUser', function(req,res){


	console.log(req.body)

	// let insertTimes = (client, cb) =>{
	// 	_.each(req.body.time, (time) =>{
	// 		console.log(req.body.info.name, req.body.info.location)
	// 		client.query(`insert into public.dates
	// 								(start_date, end_date, fk_event)
	// 								values ('${time.start}',
	// 								'${time.end}',
	// 								(select id from public.events where name='${req.body.info.name}' and lat=${req.body.location.lat} and long=${req.body.location.long}))`,
	// 								(err, result) =>{
	// 									console.log(err, 'check error')
	// 									console.log(result, ' result from insert statement')
	// 								}
	// 		);
	// 	});
	// 	cb();
	// };

	// insert into public.events (name, host, description, lat, long) values(,,,,,,);
	new Promise((resolve, reject) =>{
		pool.connect(function(err, client, done) {
		  if(err) {
		  	reject(err);
		  }
		  resolve(client);
		});
	}).then((client) =>{
		client.query(`insert into public.users
									(name, email, password)
									values ('${req.body.userinfo.name}',
									'${req.body.userinfo.email}',
									'${req.body.userinfo.password}')`,

								(err, result) =>{
									console.log(err, 'check error')
									console.log(result, ' result from insert statement')
									res.send();
								}
		);
	});
})

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
*/

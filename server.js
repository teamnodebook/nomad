const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const path = require('path');
const app = express();

const port = process.env.PORT || 5000; // port

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'src/client/public/'))); // static files

app.listen(port, () =>{
	// listening
	console.log('Music Junky listening on: ', port);
});
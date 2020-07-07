/*
 * 
 */

// HTTP Modul einbinden
var http = require('http');

// URL Modul einbinden
var url = require('url');

var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());
// HTTP Server erzeugen
var server = http.createServer(app);

// Server an Port binden
server.listen(3000);

app.use(express.static(__dirname+'/webapp'))

app.get('/add/:param1/:param2', (req, res)=>{
	
	res.contentType('text/html');
	
	let param1 = parseFloat(req.params.param1);
	let param2 = parseFloat(req.params.param2);
	
	let ergebnis = param1+param2;
	res.status(200).send(`${ergebnis}`);
})

app.get('/sub/:param1/:param2', (req, res)=>{
	res.contentType('text/html');
	
	let param1 = parseFloat(req.params.param1);
	let param2 = parseFloat(req.params.param2);
	
	let ergebnis = param1-param2;
	res.status(200).send(`${ergebnis}`);
})

app.get('/mul/:param1/:param2', (req, res)=>{
	res.contentType('text/html');
	
	let param1 = parseFloat(req.params.param1);
	let param2 = parseFloat(req.params.param2);
	
	let ergebnis = param1*param2;
	res.status(200).send(`${ergebnis}`);
})

app.get('/div/:param1/:param2', (req, res)=>{
	res.contentType('text/html');
	
	let param1 = parseFloat(req.params.param1);
	let param2 = parseFloat(req.params.param2);
	
	let ergebnis = param1/param2;
	res.status(200).send(`${ergebnis}`);
})


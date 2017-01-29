#!/usr/bin/env node
"use strict";

var app = require("./app.js");
var debug = require("debug")("express:server");
var http = require("http");

//var port = process.env.PORT || 8080;
var port = 8080;
app.set("port", port);

//create http server
var server = http.createServer(app);

console.log("Running...");

//listen on provided ports
server.listen(port);

//add error handler
//server.on("error", onError);

//start listening on port
//server.on("listening", onListening);



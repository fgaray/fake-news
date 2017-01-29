var express = require("express");
var mongoose = require ("mongoose");

// databse config

var uristring =
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/fake-news';

var theport = process.env.PORT || 5000;


mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});

// end database config




// schemas


var fakeNew = new mongoose.Schema({

});

// end schemas

var app = express();


app.get('/', function (req, res) {
    res.send("hola mundo");
});


module.exports = app;

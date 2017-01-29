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
  titulo: String,
  imagenes: [{
    imagen: String,   // En base 64
    texto: String     // OCR
  }],
  fuentes: [{
    nombre: String,
    url: String,
    votosPositivos: Number,
    votosNegativos: Number,
    ipVoto: [{
      ip: String
    }]
  }],
  ipSubida: String,
  fuente: String      // facebook, whatsapp, etc
});

// end schemas

var app = express();


app.get('/', function (req, res) {
    res.send("hola mundo");
});


module.exports = app;

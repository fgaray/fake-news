var express = require("express");
var mongoose = require ("mongoose");
var mustacheExpress = require('mustache-express');

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
  hash: String,       // hash para identificar a la noticia sin tener que publicar el id interno de la DB, hash(texto)
  imagenes: [{
    imagen: String,     // En base 64
    amazonURL: String,  // TODO: Subir las imagenes a Amazon
    texto: String       // OCR
  }],
  fuentes: [{
    nombre: String,
    url: String,
    votosPositivos: Number,
    votosNegativos: Number,
    ipVoto: [{
      ip: String
    }],
    favor: Boolean    // true si la fuente es a favor, false si la fuente es en contra.
  }],
  reportes: [
    { ip: String
    , mensaje: String
    }
  ],
  ipSubida: String,
  fuente: String      // facebook, whatsapp, etc
});

// end schemas

var app = express();


app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static('public'))

//end config app

app.get('/', function (req, res) {
    res.render("index.html", {saludo: "mundo"});
});

app.get("/n/:string", function(req, res, hash){
  res.render("noticia.html");
});


module.exports = app;

var express = require("express");
var mongoose = require ("mongoose");
var mustacheExpress = require('mustache-express');
var mustache = require('mustache');
var multer  = require('multer');



var upload = multer({ dest: 'uploads/', limits: {fileSize: 5} });


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


var FakeNew = mongoose.model('FakeNew', fakeNew);

// end schemas

var app = express();


app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static('public'))

//end config app







app.get('/', function (req, res) {
    var masVisitadas = "";
        recientes = "";
        templateLista = "<li> {{titulo}} </li>";

    for (i = 1; i < 5; i++) {
        masVisitadas += mustache.render(templateLista, {titulo: "visitadas " + i} );
        recientes    += mustache.render(templateLista, {titulo: "recientes " + i} );
    }
    res.render("index.html", {
        noticiasVisitadas: masVisitadas,
        noticiasRecientes: recientes,
    });
});

app.get("/n/:string", function(req, res, hash){
  FakeNew.findOne({ "hash": hash}, function(err, noticia){
    if(err){
      // 404 de las noticias, ofrecemos crear una nueva noticia si es que no se
      // encuentra la que se está buscando
      res.status(500);
      res.render("500.html");
    }else{
      if(noticia === null){
        res.render("404Noticia.html");
      }else{
        res.render("noticia.html");
      }
    }
  });
});


app.get("/nueva", function(req, res){
  res.render("nuevaNoticia.html");
});

//solo se permiten un maximo de 5 fotos por noticia
app.post("/nueva", upload.array('photos', 5), function(req, res){
  var files = req.files;  // fields de las imagenes
  var body = req.body;    // fields de texto

  for(var i = 0; i < files.length; i++){
    var file = files;
    console.log(file);
  }

});


//debe ir al final de todo. 404 general
app.get("*", function(req, res){
  res.status(404);
  res.render("404.html");
});


module.exports = app;

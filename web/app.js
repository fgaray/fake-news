var express = require("express");
var mongoose = require ("mongoose");
var mustacheExpress = require('mustache-express');
var mustache = require('mustache');
var Memcached = require('memcached');
var exec = require('child_process').exec;
var formidable = require('formidable');
var bodyParser = require('body-parser');
var fs = require("fs");







var memcached = new Memcached('web_memcached_1:11211');


// databse config

var uristring = 'mongodb://web_mongo_1/fake-news';

var theport = process.env.PORT || 5000;


//mongoose.connect(uristring, function (err, res) {
  //if (err) {
    //console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  //} else {
    //console.log ('Succeeded connected to: ' + uristring);
  //}
//});

// end database config




// schemas


var fakeNew = new mongoose.Schema({
  titulo: String,
  hash: String,       // hash para identificar a la noticia sin tener que publicar el id interno de la DB, hash(texto)
  imagenes: [{
    imagen: String,     // En base 64
    amazonURL: String,  // TODO: Subir las imagenes a Amazon
    texto: String,       // OCR
    salidaTesseract: String // para debug
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
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


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

// TODO temporal, para poder ver la pagina sin tener noticias 
app.get('/noticia', function (req, res) {

    res.render("noticia.html", {
        titulo: "Noticia título",
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
app.post("/nueva", function(req, res){
  var form = new formidable.IncomingForm()
  form.encoding = 'utf-8';


  form.parse(req, function(err, fields, files){
    res.send("Listo");
  });



  form.on('end', function(fields, files){

    /* Temporary location of our uploaded file */
    var temp_path = this.openedFiles[0].path;
    /* The file name of the uploaded file */
    var file_name = this.openedFiles[0].name;
    /* Location where we want to copy the uploaded file */
    var new_location = './public/uploads/';

    fs.readFile(temp_path, function(err1, data) {
      fs.writeFile(new_location + file_name, data, function(err2) {
        fs.unlink(temp_path, function(err3) {
          if (err1 || err2 || err3) {
            console.error(err1);
            console.error(err2);
            console.error(err3);
          }else{
            //hacemos el reconocimiento de texto

            exec("tesseract " + new_location + file_name + " stdout", function(error, stdout, stderr){
              var fn = FakeNew({
                imagenes: [{
                  imagen: new_location + file_name,
                  amazonURL: "",
                  texto: stdout,
                  salidaTesseract: stderr 
                }],
                ipSubida: req.headers['x-forwarded-for']
              });


              fn.save(function(err){
                console.log(files);
                console.log(fields);
              });

            });

          }
        });
      });
    });

  });


});


//debe ir al final de todo. 404 general
app.get("*", function(req, res){
  res.status(404);
  res.render("404.html");
});



module.exports = app;

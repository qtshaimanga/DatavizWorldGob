var express = require('express');
var path = require('path');
var data = require('./server/data');

var bodyParser = require('body-parser');
var _ = require('lodash');
var fs = require('fs');

var selection = require('./server/selection');


var app = express();

  app.get('/src/personnes/templates/personneTemplate.html', function(request, response, next) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        fs.readFile(__dirname + '/public/src/personnes/templates/personneTemplate.html', 'utf8', function(err, text){
            response.send(text);
        });

  });

  app.use(express.static ( path.resolve(__dirname, '.', 'public'), {"Access-Control-Allow-Origin": "*"} ));

	app.use(function(request, response, next) {
	  response.header("Access-Control-Allow-Origin", "*");
	  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});




  app.get('/selection', selection.list);

  app.get('/pays', selection.paysList);

  app.get('/pays/:name', selection.findBySection);

  //app.get('/sections/:name/:pays', selection.findBySections);

  var server = app.listen(3000, function(){
         console.log('server ready on localhost:3000');
  })

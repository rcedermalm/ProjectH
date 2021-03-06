// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');                         // log requests to the console (express4)
var bodyParser = require('body-parser');                // pull information from HTML POST (express4)
var methodOverride = require('method-override');        // simulate DELETE and PUT (express4)
var fs = require('fs');                                 // Filewriting var'
var stringify = require('stringifier').stringify;       // This may be redundant, prepare to take it away.

// configuration =================
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");

// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// This is for handling input form the client, it types it out with console.log
// This input is the path to the folder to be added to the database
app.post('/filepath', function(req,res) {
    res.contentType('text/html');
    directoryToFolder = req.body;
    console.log(Object.keys(directoryToFolder));
});

// This is for handling input form the client, it types it out with console.log
app.post('/upload', function(req,res) {
  res.contentType('application/json');

    // This is taking care of writing to a file (in cour case td.json), first argument is the filepath, second is what goes in.
    // Is currently hard coded to write to \\teatime.westeurope.cloudapp.azure.com\SharedStorage\nyTest123.
    fs.writeFile( '\\\\teatime.westeurope.cloudapp.azure.com\\SharedStorage\\' + Object.keys(directoryToFolder) + '\\'  + 'td.json',JSON.stringify(req.body), (err) =>{
        if (err) throw err;
        console.log('Saved: ' + JSON.stringify(req.body) + ', to: ' + Object.keys(directoryToFolder) + '\\td.json' );
    })

});


/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  http = require('http'),
  request = require('request'),
  rss = require('./rss').rss,
  states = require('./states').states,
  path = require('path');

var app = express();

app.configure(function() {
  app.use(express.compress());
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/state/:state', function(req, res) {

  var myState;
  var st = req.params.state.trim();

  if (st.length == 2) {
    myState = states.byCode(st);
  } else {
    myState = states.byName(st);
  }

  try {
    rss.state(myState.id, function(items) {
      res.send(items, 200);
    })
  } catch (ex) {
    res.send("Requested State: " + st + " NOT FOUND", 404);

  }

});

app.get('/states', function(req, res) {
  res.send(states.all(), 200);
});

app.get('/current', function(req, res) {

  rss.current(function(items) {
    res.send(items, 200);
  })

});



http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
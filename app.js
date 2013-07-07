var ams_master_key = '';

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
  cache = require('memory-cache'),
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

    if (cache.get(myState) === null) {

      rss.state(myState.id, function(items) {
        // put the state into the cache for 1 hour
        cache.put(myState, items, 3600000);
        // send the response
        res.send(items, 200);

      });

    } else {
      // send the cached response w
      res.send(cache.get(myState), 200);
    }

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
  });

});

app.get('/search/:q', function(req, res) {

});

app.get('search/:st/:cn', function(req, res) {

  var caseNumber = req.params.cn.toString();
  var list = cache.get(req.params.st.toString());


  if (list === null) {
    rss.state(req.params.st.toString(), function(list) {
      list.forEach(function(c) {
        if (c.caseNumber === caseNumber) {
          res.send(c, 200);
        }
      });
    });
  } else {
    list.forEach(function(c) {
      if (c.caseNumber === caseNumber) {
        res.send(c, 200);
      }
    });
  }

});


http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});



// jobs to keeps the cache current, 

var currentJob = function() {
  console.log("Running Current Job.");

  var current = cache.get("current");

  rss.current(function(items) {

    if (current === null) {

      var list = {};

      items.forEach(function(child) {
        list[child.caseNumber] = child;
        console.log(child.caseNumber + ':' + child.name);
      });

      cache.put("current", list, 3600000);

    } else {
      console.log('checking refresh versus items');
      var list = cache.get('current');
      var newList = {};
      items.forEach(function(c) {
        if (list[c.caseNumber] === null) {
          // new child exist send notification
          console.log('new child');
        } else {
          console.log(c.caseNumber + ':' + c.name);
        }

        newList[c.caseNumber] = c;

      });

      cache.put("current", newList, 3600000);

    }

  });

  console.log('Current Job Complete');

};

var statesJob = function() {
  console.log("Running States Job.");

  var stateList = states.all();
  for (var i = 0; i < 50; i++) {
    var st = stateList[i];
    console.log('Starting Job for: ' + st.id);
    try {
      rss.state(st.id, function(items) {

        // if the items in cache is different then update the cache
        if (JSON.stringify(items) != JSON.stringify(cache.get(items[0].state))) {
          console.log('Inserting ' + items[0].state + ' into cache');
          cache.put(items[0].state, items, 3600000);
        } else {
          // update the cache
          console.log('Updating ' + items[0].state + ' cache');
          cache.put(items[0].state, items, 3600000);
        }

      });

    } catch (err) {
      console.log(st.id + ':' + err);
      // something went wrong, extend the item in the cache for 1 more hour.
      if (cache.get(st.id) !== null) {
        cache.put(st.id, cache.get(st.id), 3600000);
      }
    }
  }

};

setInterval(currentJob, 60000);
setInterval(statesJob, 2700000);
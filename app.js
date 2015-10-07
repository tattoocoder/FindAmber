var ams_master_key = '';

/**
 * Module dependencies.
 */

var express = require('express'),
    //routes = require('./routes'),
    //user = require('./routes/user'),
    http = require('http'),
    request = require('request'),
    rss = require('./rss').rss,
    states = require('./states').states,
    cache = require('memory-cache'),
    path = require('path'),
    compression = require('compression');

var app = express();


    app.use(compression());
    app.set('port', process.env.PORT || 3000);

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/state/:state', function (req, res) {

    var myState;
    var st = req.params.state.trim();

    if (st.length == 2) {
        myState = states.byCode(st);
    } else {
        myState = states.byName(st);
    }

    try {

        if (cache.get(myState) === null) {

            rss.state(myState.id, function (items) {
                // put the state into the cache for 1 hour
                cache.put(myState, items, 3600000);
                // send the response
                res.send(items, 200);

            });

        } else {
            // send the cached response with the 200 response
            res.send(cache.get(myState), 200);
        }

    } catch (ex) {
        res.send("Requested State: " + st + " NOT FOUND", 404);

    }

});

app.get('/states', function (req, res) {
    res.send(states.all(), 200);
});

app.get('/current', function (req, res) {

    var cur = cache.get('current');
    if (cur === null) {
        console.log('getting from rss');
        rss.current(function (items) {
            cache.put("current", items, 3600000);
            res.send(items, 200);
        });
    } else {
        console.log('getting from cache');
        res.send(cur, 200);

    }



});

app.get('/case/:cn', function (req, res) {

    var child = cache.get(req.params.cn);
    if (child == null) {
        res.send(child, 404);
    }
    res.send(child, 200);
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

// jobs to keeps the cache current,
var currentJob = function () {
    console.log("Running Current Job.");
    var current = cache.get("current");
    rss.current(function (items) {
        var list = [];
        var life = 3600000;
        if (current === null) {
            items.forEach(function (child) {
                list.push(child);
                //list[child.caseNumber] = child;
                console.log(child.caseNumber + ':' + child.name);
            });
            cache.put("current", list, 3600000);
        } else {
            console.log('checking refresh versus items');
            list = cache.get('current');

            var newList = [];
            // refreshed list == items
            items.forEach(function (c) {
                var exists = false;
                // cache
                list.forEach(function (old) {
                    if (old.caseNumber === c.caseNumber) {
                        exists = true;
                    }
                });

                if (exists !== true) {
                    // new child
                    console.log("new child");
                }
                newList.push(c);
            });
            cache.put("current", newList, life);
        }
    });
    console.log('Current Job Complete');
};

var statesJob = function () {
    console.log("Running States Job.");

    var stateList = states.all();
    var life = 3600000;

    for (var i = 0; i < 50; i++) {
        var st = stateList[i];
        console.log('Starting Job for: ' + st.id);
        try {
            rss.state(st.id, function (items) {
                // if the items in cache is different then update the cache
                if (JSON.stringify(items) !== JSON.stringify(cache.get(items[0].state))) {
                    console.log('Inserting ' + items[0].state + ' into cache');
                    cache.put(items[0].state, items, life);
                } else {
                    // update the cache
                    console.log('Updating ' + items[0].state + ' cache');
                    cache.put(items[0].state, items, life);
                }
                // update or insert the individual child records cache
                for (var c = 0; c < items.length; c++) {
                    var child = items[c];
                    var existing = cache.get(child.caseNumber);
                    if (existing == null) {
                        cache.put(child.caseNumber, child, life);
                    } else {
                        // compare to see if the obj has changed
                        if (JSON.stringify(child) !== JSON.stringify(existing)) {
                            cache.put(child.caseNumber, child, life);
                        }
                    }
                }
            });
        } catch (err) {
            console.log(st.id + ':' + err);
            // something went wrong, extend the item in the cache for 1 more hour.
            if (cache.get(st.id) !== null) {
                cache.put(st.id, cache.get(st.id), life);
            }
        }
    }
};

setInterval(currentJob, 60000);
setInterval(statesJob, 2700000);

// run the jobs on startup
currentJob();
statesJob();
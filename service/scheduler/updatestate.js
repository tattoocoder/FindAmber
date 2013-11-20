var rss = require('../shared/rssreader'),
    states = require('../shared/states').states,
    req = require('request'),
    async = require('async');

var myStates = [];

var getData = function(url, callback){
    req.get(
        { url: testUrl },
        function (error, result, body) {
            if(error)
            {
                console.error(error);
            } else {
                console.log(body);
            }

            // done let async know
            callback(null);
        });
}

function stateJob() {
    console.log("Running States Job.");
    var stateList = states.all();
    for (var i = 0; i < 50; i++) {
        var st = stateList[i];
        console.log(st.id + ':' + st.name);

        var url = rss.getStateUrl(st.id);
        console.log(url);

        myStates.push(url);

    }

    console.log('going to async now');
    async.each(myStates, getData, function (err) {
        console.log('all states are done now');
    });

}

function UpdateState() {
    console.log('Starting UpdateState Job');
    stateJob();
}


//single works - inside of a loop does not
    //var testUrl = rss.getStateUrl('FL');
    //var req = require('request');
    //req.get(
    //    { url: testUrl },
    //    function (error, result, body) {
    //        if(error)
    //        {
    //            console.error(error);
    //        } else {
    //            console.log(body);
    //        }
    //    });
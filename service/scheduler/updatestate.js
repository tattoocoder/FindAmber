var rss = require('../shared/rssreader'),
    states = require('../shared/states').states,
    moment = require('moment');

var stateTable = tables.getTable('State');

function process(id, name, url) {
    var state = {
        abbrev: id.toUpperCase(),
        name: name,
        url: url,
        firstRun: true,
        lastUpdate: moment().format()
    };

    stateTable.where({ abbrev: state.abbrev })
    .read({
        success: function (results) {

            if (results === null || results.length === 0) {
                stateTable.insert(state);
            } else {
                state.firstRun = false;
                state.id = results[0].id;
                stateTable.update(state);
            }
        }
    });

}


function stateJob() {
    console.log("Running States Job.");
    var stateList = states.all();
    for (var i = 0; i < 50; i++) {
        var st = stateList[i];

        var url = rss.getStateUrl(st.id);
        
        process(st.id, st.name, url);

    }

}

function UpdateState() {
    console.log('Starting UpdateState Job');
    stateJob();
}



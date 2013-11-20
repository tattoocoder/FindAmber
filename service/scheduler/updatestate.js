var rss = require('../shared/rssreader');
var states = require('../shared/states').states;

var childTable = tables.getTable('Child');

function insertOrUpdateChild(item, st) {

    childTable.where({ name: item.caseNumber, state: st.toUpperCase() })
    .read({
        success: function (results) {

            if (results === null || results.length === 0) {
                childTable.insert(item);
            } else {
                childTable.update(item);
            }
        }
    });
}
var checkChildren = function (items) {

    console.log('Check children');
    // go through each of the items, see if the item is in the database, 
    // does it need updated or inserted
    for (var c = 0; c < items.length; c++) {
        insertOrUpdateChild(c);
    }

}

var processFeed = function(body){
    console.log(body);
}

function stateJob() {
    console.log("Running States Job.");
    var stateList = states.all();
    for (var i = 0; i < 50; i++) {
        var st = stateList[i];
        console.log(st.id + ':' + st.name);

        var url = rss.getStateUrl(st.id);
        console.log(url);

        rss.downloadFeed(url, processFeed);
         
    }

}

function UpdateState() {
    console.log('Starting UpdateState Job');
    stateJob();
}
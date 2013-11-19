var rss = require('../shared/rss').rss;
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

function stateJob() {
    console.log("Running States Job.");
 var stateList = states.all();
    for (var i = 0; i < 50; i++) {
        var st = stateList[i];
        console.log(st.id);   
    }

}

function UpdateState() {
    console.log('Starting UpdateState Job');
    stateJob();
}
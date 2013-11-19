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
        console.log('Starting Job for: ' + st.id);
        try {
            rss.state(st.id, function (items) {
                //// if the items in cache is different then update the cache
                //if (JSON.stringify(items) != JSON.stringify(cache.get(items[0].state))) {
                //    console.log('Inserting ' + items[0].state + ' into cache');
                //    cache.put(items[0].state, items, 3600000);
                //}
                //else {
                //    // update the cache
                //    console.log('Updating ' + items[0].state + ' cache');
                //    cache.put(items[0].state, items, 3600000);
                //}


                // go through each of the items, see if the item is in the database, 
                // does it need updated or inserted
                for (var c = 0; c < items.length; c++) {
                    insertOrUpdateChild(c);
                }

            });
        }
        catch (err) {
            //console.log(st.id + ':' + err);
            //// something went wrong, extend the item in the cache for 1 more hour.
            //if (cache.get(st.id) !== null) {
            //    cache.put(st.id, cache.get(st.id), 3600000);
            //}
        }
    }
}

function UpdateState() {
    console.log('Starting UpdateState Job');
    stateJob();
}
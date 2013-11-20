var req = require('request');
var stateTable = tables.getTable('State');

function update(item, user, request) {
    
    stateTable.where({abbrev: item.abbrev})
        .read({
            success: function (results) {
                 if (results === null || results.length === 0){
                    var old = results[0];
                    if (item.lastUpdate !== old.lastUpdate) {
                        // go get the data
                        console.log('need to update the data for state');
                         req.get({ url: item.url },function (error, result, body) {
                           if (error) {
                               console.error(error);
                           } else {
                               console.log(body);
                           }
                           // execute the update
                           request.execute();
                       });
                    }
                }
            }
        });
    }
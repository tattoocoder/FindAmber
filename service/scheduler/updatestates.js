var request = require('request');
var states_url = 'http://findamber-api.azurewebsites.net/states';
var list_url = 'http://findamber-api.azurewebsites.net/state/';

var childTable = tables.getTable('Child');

function insertOrUpdateChild(item, st){
    childTable.where({name: item.name, state: st.toUpperCase()})
    .read({ success: function(results){
            
            if (results === null || results.length === 0){
                childTable.insert(item);
            } else {
                childTable.update(item);
            }
        }
    });
}

function getStateItems(st) {
   console.log('running state - ' + st.id);
   var url = list_url + st.id;
   console.log(url);
    
    request(url, function(error, response, body) {
        if (error !== null) {
            console.log(error);
        } else {
            var items = JSON.parse(body);
            
            for(var i = 0;i<items.length;i++){
                insertOrUpdateChild(items[i], st);
            }
        }
        
    });
}

function process(error, response, body){
    console.log(body);
}

function UpdateStates() {
    request(states_url, function(error, response, body){
        
       var states = JSON.parse(body);
       console.log(states);
           
       for(var i = 0; i < 50; i++){
           var state = states[i];
     //      console.log(state.id + '-' + state.name);
     //      getStateItems(state);
            console.log(list_url + state.id);
   //        request(list_url + state.id, process);
                 
       } 
       
    });
       
}

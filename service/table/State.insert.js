var req = require('request');


function insert(item, user, request) {

    if (item.firstRun === true) {
                console.log('first run ' + item.abbrev + ' getting data');
                req.get({ url: item.url },function (error, result, body) {
                       if (error) {
                           console.error(error);
                       } else {
                           console.log(body);
                       }
                       request.execute();
                   });
    } else {
        request.execute();
    }

}
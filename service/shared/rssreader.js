// rssreader

// private vars
var state_url = 'http://www.missingkids.com/missingkids/servlet/XmlServlet?act=rss&LanguageCountry=en_US&orgPrefix=NCMC&state=~state';
var current_url = 'http://www.missingkids.com/missingkids/servlet/XmlServlet?act=rss&LanguageCountry=en_US&orgPrefix=NCMC';

// request object, user-agent is the magic key. if not set you may get 403.
var options = {
    host: "missingkids.com",
    port: 80,
    uri: "",
    headers: {
        Host: "missingkids.com",
        "User-Agent": "Find Amber API"
    }
};

var cheerio = require('cheerio'),
    moment = require('moment'),
    request = require('request');


function download(url, callback) {
    var items = [];
    console.log(url);

    request(url, function (error, response, body) {

        var $ = cheerio.load(body, {
            ignoreWhitespace: true,
            xmlMode: true,
            lowerCaseTags: true
        });

        callback($);

        //$('item').each(function (i, item) {

        //    var child = parseItem($, item);
        //    items.push(child);


        //});

        //callback(items);

    });

};


exports.getStateUrl = function (state) {
    console.log('Getting url for ' + state);
    var url = state_url.replace('~state', state);
    return url;
}

exports.downloadFeed = function (url, callback) {
    console.log('Downloading feed for ' + url);
    download(url, callback);
}
// http://www.missingkids.com/missingkids/servlet/XmlServlet?act=rss&LanguageCountry=en_US&orgPrefix=NCMC&state={0}



var rss = (function() {
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

	//function internal() {
	//    // ...
	//}
	function validateImage(img, cb) {
		//console.log(img);
		request(img, function(error, response, body){
			//console.log(response.statusCode);

			if (!error && response.statusCode == 200) {
    				cb();
  				}
		});

	};

	function parseItem($, item) {
		var update = {
			name: "",
			ageNow: 0,
			caseType: "",
			state: "",
			dateReported: "",
			missingFrom: "",
			contactName: "",
			contactPhone: "",
			photos: [],
			photoC: [],
			photoX: [],
			abductor1: "",
			abductor2: "",
			poster: "",
			caseNumber: ""
		};

		var title = $(item).find('title').text();
		var description = $(item).find('description').text();
		var pubDate = $(item).find('pubdate');
		var url = $(item).find('link');

		var d = '';
		if (pubDate !== null) {
			d = pubDate.text();
		}

		if (moment(d).isValid()) {
			update.dateReported = moment(d, 'MM-DD-YYYY');
		}


		var parts = title.split(':');
		update.caseType = parts[0];

		var i = parts[1].indexOf("(");

		if (i > -1) {
			var pieces = parts[1].split("(");
			update.name = pieces[0].trim();
			update.state = pieces[1].replace("(", "").replace(")", "").trim();
		} else {
			update.name = parts[1].trim();
			update.state = "";
		}


		var summary = description.split(',');

		// get the current age 
		var age = summary[1].split(':')[1].trim();

		if (age != null) {
			update.ageNow = age.trim();
		}

		if (update.ageNow == null) {
			update.ageNow = "Unknown";
		}

		// get the missing from text
		var x = summary.toString().toLowerCase().indexOf("missing from");
		var temp = summary.toString().substring(x + 13);
		update.missingFrom = temp.substring(0, (temp.indexOf("."))).trim();

		// get contact information
		x = summary.toString().toLowerCase().indexOf('should contact:');

		try {
			update.contactName = summary.toString().substring(x + 15); //, (summary.toString().toLowerCase().indexOf(' (') - (x + 15))).trim();

			if (update.contactName.indexOf(' (') > -1) {
				update.contactName = update.contactName.substring(0, update.contactName.indexOf(' (')).trim();
			} else {
				update.contactName = update.contactName.substring(0, update.contactName.indexOf(' 1-')).trim();
			}
		} catch (err) {
			console.log(err)
			try {
				update.contactName = summary.toString().substring(x + 15).trim();
			} catch (ex2) {}
		}

		// get the phone number from the summary
		var phone = summary.toString().substring(summary.toString().indexOf(')') + 1);
		phone = phone.replace('.', '').trim();

		update.contactPhone = phone;

		// get the cxase number from the link or url of the item
		var params = url.toString().split("&");

		for (var s = 0; s < params.length; s++) {

			if (params[s].toString().toLowerCase().indexOf('casenum') >= 0) {
				update.caseNumber = params[s].toString().split('=')[1].trim();
				break;
			}

		}


		if (update.caseNumber.length > 0) {
			var baseUrul = "http://www.missingkids.com/photographs/NCMC" + update.caseNumber;


			validateImage(baseUrul + "c1t.jpg", function(){ 
				update.photos.push(baseUrul + "c1t.jpg");
			});


			validateImage(baseUrul + "c2t.jpg", function(){ 
				update.photos.push(baseUrul + "c2t.jpg");
			});

			validateImage(baseUrul + "c3t.jpg", function(){ 
				update.photos.push(baseUrul + "c3t.jpg");
			});

			validateImage(baseUrul + "c4t.jpg", function(){  
				update.photos.push(baseUrul + "c4t.jpg");
			});

			validateImage(baseUrul + "c5t.jpg", function(){ 
				update.photos.push(baseUrul + "c5t.jpg");
			});


			validateImage(baseUrul + "c1.jpg", function(){ 
				update.photoC.push(baseUrul + "c1.jpg");
			});

			validateImage(baseUrul + "c2.jpg", function(){ 
				update.photoC.push(baseUrul + "c2.jpg");
			});

			validateImage(baseUrul + "c3.jpg", function(){ 
				update.photoC.push(baseUrul + "c3.jpg");
			});
			
			validateImage(baseUrul + "c4.jpg", function(){  
				update.photoC.push(baseUrul + "c4.jpg");
			});

			validateImage(baseUrul + "c5.jpg", function(){ 
				update.photoC.push(baseUrul + "c5.jpg");
			});

			validateImage(baseUrul + "x1.jpg", function(){ 
				update.photoX.push(baseUrul + "x1.jpg");
			});

			validateImage(baseUrul + "x2.jpg", function(){ 
				update.photoX.push(baseUrul + "x2.jpg");
			});

			validateImage(baseUrul + "x3.jpg", function(){ 
				update.photoX.push(baseUrul + "x3.jpg");
			});
			
			validateImage(baseUrul + "x4.jpg", function(){  
				update.photoX.push(baseUrul + "x4.jpg");
			});

			validateImage(baseUrul + "x5.jpg", function(){  
				update.photoX.push(baseUrul + "x5.jpg");
			});

			validateImage(baseUrul + "a1.jpg", function(){  
				update.abductor1 = baseUrul + "a1.jpg";
			});

			validateImage(baseUrul + "a2.jpg", function(){ 
				update.abductor2 = baseUrul + "a2.jpg";
			});
		}

		// set the poster 
		update.poster = 'http://www.missingkids.com/missingkids/servlet/PubCaseSearchServlet?act=viewPoster&caseNum=' + update.caseNumber + '&orgPrefix=NCMC&searchLang=en_US';


		return update;
	};

	

	function download(url, cb) {
		var items = [];

		request(url, function(error, response, body) {

			var $ = cheerio.load(body, {
				ignoreWhitespace: true,
				xmlMode: true,
				lowerCaseTags: true
			});


			$('item').each(function(i, item) {

				var update = parseItem($, item);
				items.push(update);
			});

			cb(items);

		});

	};

	return {
		// public interface
		current: function(callback) {

			console.log(current_url);
			download(current_url, callback);

		},

		state: function(state, callback) {

			var url = state_url.replace('~state', state);
			download(url, callback);

		}
	}
})();


exports.rss = rss;
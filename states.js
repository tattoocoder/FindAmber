var states = (function() {
	// private vars
	// var x = 0;

	var list = {
		0: {
			id: "AK",
			name: "Alaska"
		},
		1: {
			id: "AL",
			name: "Alabama"
		},
		2: {
			id: "AZ",
			name: "Arizona"
		},
		3: {
			id: "AR",
			name: "Arkansas"
		},
		4: {
			id: "CA",
			name: "California"
		},
		5: {
			id: "CO",
			name: "Colorado"
		},
		6: {
			id: "CT",
			name: "Connecticut"
		},
		7: {
			id: "DE",
			name: "Delaware"
		},
		8: {
			id: "FL",
			name: "Florida"
		},
		9: {
			id: "GA",
			name: "Georgia"
		},
		10: {
			id: "HI",
			name: "Hawaii"
		},
		11: {
			id: "ID",
			name: "Idaho"
		},
		12: {
			id: "IL",
			name: "Illinois"
		},
		13: {
			id: "IN",
			name: "Indiana"
		},
		14: {
			id: "IA",
			name: "Iowa"
		},
		15: {
			id: "KS",
			name: "Kansas"
		},
		16: {
			id: "KY",
			name: "Kentucky"
		},
		17: {
			id: "LA",
			name: "Louisiana"
		},
		18: {
			id: "ME",
			name: "Maine"
		},
		19: {
			id: "MD",
			name: "Maryland"
		},
		20: {
			id: "MA",
			name: "Massachusetts"
		},
		21: {
			id: "MI",
			name: "Michigan"
		},
		22: {
			id: "MN",
			name: "Minnesota"
		},
		23: {
			id: "MS",
			name: "Mississippi"
		},
		24: {
			id: "MO",
			name: "Missouri"
		},
		25: {
			id: "MT",
			name: "Montana"
		},
		26: {
			id: "NE",
			name: "Nebraska"
		},
		27: {
			id: "NV",
			name: "Nevada"
		},
		28: {
			id: "NH",
			name: "New Hampshire"
		},
		29: {
			id: "NJ",
			name: "New Jersey"
		},
		30: {
			id: "NM",
			name: "New Mexico"
		},
		31: {
			id: "NY",
			name: "New York"
		},
		32: {
			id: "NC",
			name: "North Carolina"
		},
		33: {
			id: "ND",
			name: "North Dakota"
		},
		34: {
			id: "OH",
			name: "Ohio"
		},
		35: {
			id: "OK",
			name: "Oklahoma"
		},
		36: {
			id: "OR",
			name: "Oregon"
		},
		37: {
			id: "PA",
			name: "Pennsylvania"
		},
		38: {
			id: "RI",
			name: "Rhode Island"
		},
		39: {
			id: "SC",
			name: "South Carolina"
		},
		40: {
			id: "SD",
			name: "South Dakota"
		},
		41: {
			id: "TN",
			name: "Tennessee"
		},
		42: {
			id: "TX",
			name: "Texas"
		},
		43: {
			id: "UT",
			name: "Utah"
		},
		44: {
			id: "VT",
			name: "Vermont"
		},
		45: {
			id: "VA",
			name: "Virginia"
		},
		46: {
			id: "WA",
			name: "Washington"
		},
		47: {
			id: "WV",
			name: "West Virginia"
		},
		48: {
			id: "WI",
			name: "Wisconsin"
		},
		49: {
			id: "WY",
			name: "Wyoming"
		}
	}

	//function internal() {
	//    // ...
	//}

	// public 
	return {
		// public interface
		byCode: function(code) {

			for (var i = 0; i < 50; i++) {
				console.log(list[i]);
				if (list[i].id === code.toUpperCase()) {

					return list[i];
				}
			}

			return null;

		},

		byName: function(name) {

			for (var i = 0; i < 50; i++) {
				if (list[i].name.toUpperCase() === name.toUpperCase()) {

					return list[i];
				}
			}

			return null;

		},

		all: function() {
			return list;
		}
	}
})();


exports.states = states;
var fs = require("fs");
var readline = require("readline");
var google = require("googleapis");

module.exports = {
	getCalendar: (req, res) => {
		getCalendar(req, res);
	},
	getPlayCalendar: (req, res) => {
		getPlayCalendar(req, res);
	}
};
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
// var TOKEN_DIR
// 	= (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE)
// 	+ "/.credentials/";
var TOKEN_DIR = "../credentials/";
var TOKEN_PATH = TOKEN_DIR + "calendar-credentials.json";

var getCalendar = (req, res) => {
	// Load client secrets from a local file.
	fs.readFile("./privateKeys/client_secret.json", function processClientSecrets(
		err,
		content
	) {
		if (err) {
			console.log("Error loading client secret file: " + err);
			return;
		}
		// Authorize a client with the loaded credentials, then call the
		// Google Calendar API.
		authorize(JSON.parse(content), req, res, listEvents);
	});
};

var getPlayCalendar = (req, res) => {
	// Load client secrets from a local file.
	fs.readFile("./privateKeys/client_secret.json", function processClientSecrets(
		err,
		content
	) {
		if (err) {
			console.log("Error loading client secret file: " + err);
			return;
		}
		// Authorize a client with the loaded credentials, then call the
		// Google Calendar API.
		authorize(JSON.parse(content), req, res, listPlayEvents);
	});
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, req, res, callback) {
	var clientSecret = credentials.installed.client_secret;
	var clientId = credentials.installed.client_id;
	var redirectUrl = credentials.installed.redirect_uris[0];
	var OAuth2 = google.auth.OAuth2;
	var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, function(err, token) {
		if (err) {
			getNewToken(oauth2Client, callback);
		} else {
			oauth2Client.credentials = JSON.parse(token);
			callback(oauth2Client, req, res);
		}
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
	var authUrl = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES
	});
	console.log("Authorize this app by visiting this url: ", authUrl);
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.question("Enter the code from that page here: ", function(code) {
		rl.close();
		oauth2Client.getToken(code, function(err, token) {
			if (err) {
				console.log("Error while trying to retrieve access token", err);
				return;
			}
			oauth2Client.credentials = token;
			storeToken(token);
			callback(oauth2Client);
		});
	});
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
	try {
		fs.mkdirSync(TOKEN_DIR);
	} catch (err) {
		if (err.code !== "EEXIST") {
			throw err;
		}
	}
	fs.writeFile(TOKEN_PATH, JSON.stringify(token));
	console.log("Token stored to " + TOKEN_PATH);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth, req, res) {
	var calendar = google.calendar("v3");
	var result = {};
	result.events = [];
	result.error = null;
	var date = new Date().toISOString();
	calendar.events.list(
		{
			calendarId: "primary",
			auth: auth,
			singleEvents: true,
			timeMin: date,
			maxResults: 5,
			orderBy: "startTime"
		},
		function(err, response) {
			if (err) {
				result.error = "The API returned an error: " + err;
				res.send(result);
				return;
			}
			var events = response.data.items;
			if (events.length === 0) {
				result.error = "No upcoming events found.";
				res.send(result);
				return;
			} else {
				result.events = filterEventProperties(events);
				res.send(result);
				return;
			}
		}
	);
}

function listPlayEvents(auth, req, res) {
	var calendar = google.calendar("v3");
	var result = {};
	result.events = [];
	result.error = null;
	var date = new Date().toISOString();
	calendar.events.list(
		{
			calendarId: "mpk136vfeh6aaj4nb1l9932jfc@group.calendar.google.com",
			auth: auth,
			singleEvents: true,
			timeMin: date,
			maxResults: 5,
			orderBy: "startTime"
		},
		function(err, response) {
			if (err) {
				result.error = "The API returned an error: " + err;
				res.send(result);
				return;
			}
			var events = response.data.items;
			if (events.length === 0) {
				result.error = "No upcoming events found.";
				res.send(result);
				return;
			} else {
				result.events = filterEventProperties(events);
				res.send(result);
				return;
			}
		}
	);
}

function filterEventProperties(events) {
	var resultList = [];
	for (let i = 0; i < events.length; i++) {
		const event = events[i];
		var newEvent = {
			summary: event.summary,
			start: formatDate(event.start),
			end: formatDate(event.end)
		};
		resultList.push(newEvent);
	}
	return resultList;
}

function formatDate(date) {
	var newDate;
	if (date.date) {
		var dateArr = date.date.split("-");
		newDate = dateArr[2] + "." + dateArr[1] + "." + dateArr[0];
	} else {
		var dateTime = new Date(date.dateTime);
		var month = dateTime.getMonth() + 1;
		if (month < 10) {
			month = "0" + month;
		}
		newDate = dateTime.getDate() + "." + month + "." + dateTime.getFullYear();
	}
	return newDate;
}

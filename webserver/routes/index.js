var express = require('express');
var router = express.Router();
//Fetch doesn't exist on server-side JavaScript, so we impoort a package which implements the functionality.
var fetch = require('node-fetch');
var fs = require('fs');

var loadedFiles = false;

const redirect_uri = 'http://localhost:8888/callback';
const client_uri = 'http://localhost:4200';
const spotify_base_uri = 'https://api.spotify.com/v1';

//These values will be loaded from client_secret.json
var my_client_id = null;
var my_client_secret = null;

var access_token = null;
var refresh_token = null;

/*This function does not need to be edited.*/
function writeTokenFile(callback) {
	console.log('hello from webserver.writeTokenFile()');
	console.log('callback: ' + callback);
	fs.writeFile('tokens.json', JSON.stringify({access_token: access_token, refresh_token: refresh_token}), callback);
}

/*This function does not need to be edited.*/
function readTokenAndClientSecretFiles(callback) {
	//This chains two promises together. First, client_secret.json will be read and parsed. Once it completes, tokens.json will be read and parsed.
	//These files are read synchronously (one after another) intentionally to demonstrate how promises can be chained.
	//Promise.all() could be used to conduct these two file reads asynchronously, which is more efficient.
	fs.readFile('client_secret.json', (err, data) => {
		data = JSON.parse(data);
		my_client_id = data.client_id;
		my_client_secret = data.client_secret;
		fs.readFile('tokens.json', (err, data) => {
			data = JSON.parse(data);
			access_token = data.access_token;
			refresh_token = data.refresh_token;
			callback();
		});
	});
}

function refresh(callback) {
	console.log('hello from webserver.refresh()');
	console.log('callback: ' + callback);

	const params = new URLSearchParams();
	params.append('grant_type', 'refresh_token');
	params.append('refresh_token', refresh_token);

	var headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': 'Basic ' + Buffer.from(my_client_id + ':' + my_client_secret).toString('base64')
	};

	//use fetch() to use the refresh token to get a new access token.
	//body and headers arguments are similar to the /callback endpoing
	fetch('https://accounts.spotify.com/api/token/', {
		method: 'POST',
		headers: headers,
		body: params,
		json: true
	})
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {

			console.log(data);
			access_token = data.access_token; //we don't get a new refresh token
			if (access_token != null && refresh_token != null) {
				writeTokenFile(callback);
			}
		})
		.then(function() {
			callback();
		})
		.catch(function(error) {
			console.log('in refresh(): ' + error);
			reject(error);
		});
	
	//TODO: use fetch() to use the refresh token to get a new access token.
	//body and headers arguments will be similar the /callback endpoint.

	//When the fetch() promise completes, parse the response.
	//Then, use writeTokenFile() to write the token file. Pass it a callback function for what should occur once the file is written.
}

// async function makeAPIRequest(spotify_endpoint, res) {
// 	let data = await fetch(spotify_base_uri + spotify_endpoint, {
// 		method: 'GET',
// 		headers: headers,
// 		json: true
// 	});
// 	let main = await data.json();
// 	console.log(main);
// }

function makeAPIRequest(spotify_endpoint, res) {
	console.log('hello from webserver.makeAPIRequest()');
	console.log(access_token);
	var headers = {
		'Accept': 'application/json',
		'Content-Type':'application/json',
		'Authorization': 'Bearer ' + access_token
	};
	//use fetch() to make the API call.
	//parse the response send it back to the Angular client with res.json()
	return fetch(spotify_base_uri + spotify_endpoint, {
		method: 'GET',
		headers: headers,
		json: true
	})
	.then(response => response.json())
	.then(data => {
		console.log('data: ' + JSON.stringify(data));
		res.send(data);
	})
	.catch(error => console.error(error))
	// 	// if (data.error.status == 401) {
	// 	// 	refresh(function() { //callback is this function
	// 	// 		makeAPIRequest(spotify_endpoint, res);
	// 	// 	});
	// 	// 	resolve(json);
	// 	// }
	// 	// res.send(json);
	// .catch(function(error) {
	// 	console.log('in makeAPIRequest(): ' + JSON.stringify(error));
	// });

	//Once refresh() is working, check whether the status code is 401 (unauthorized)
	//If so, refresh the access token and make the API call again.
}

/*This function does not need to be edited.*/
router.get('*', function(req, res, next) {
	//Applies to all endpoints: load the token and client secret files if they haven't been loaded.
	if(!loadedFiles) {
		readTokenAndClientSecretFiles(function() {
			loadedFiles = true;
			next();
		});
	}
	else {
		next();
	}
});

router.get('/login', function(req, res, next) {
	console.log('hello from webserver./login');
	var scopes = 'user-read-private user-read-email';

	//use res.redirect() to send the user to Spotify's authentication page.
	//use encodeURIComponent() to make escape necessary characters.
	res.redirect('https://accounts.spotify.com/authorize?' +
		'response_type=code' +
		'&client_id=' + my_client_id +
		'&scope=' + encodeURIComponent(scopes) +
		'&redirect_uri=' + encodeURIComponent(redirect_uri));
});

router.get('/callback', function(req, res, next) {
	console.log('hello from webserver./callback');
	var code = req.query.code || null;

	const params = new URLSearchParams();
	params.append('code', code);
	params.append('redirect_uri', redirect_uri);
	params.append('grant_type', 'authorization_code');

	var headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': 'Basic ' + Buffer.from(my_client_id + ':' + my_client_secret).toString('base64')
	};

	fetch('https://accounts.spotify.com/api/token/', {
		method: 'POST',
		headers: headers,
		body: params,
		json: true
	})
		.then(function(response) {
			console.log('OAUTH2: status %s %s', response.status, response.statusText);
			return response.json();
		})
		.then(function(json) {
			access_token = json.access_token;
			refresh_token = json.refresh_token;
			if (access_token != null && refresh_token != null) {
				writeTokenFile(function() {
					res.redirect(client_uri);
				});
			}
		})
		.catch(function(error) {
			console.log("Caught error:\n" + error);
			res.redirect(redirect_uri + '/login'); //return to login page to try again
		});
});

/*This function does not need to be edited.*/
router.get('/', function(req, res, next) {
	res.send('Go to the <a href="/login">login page</a> to begin the oAuth flow.');
});

/*This function does not need to be edited.*/
router.get('/me', function(req, res, next) {
	console.log('/me makes api request to ' + req.url);
	makeAPIRequest(spotify_base_uri + '/me', res);
});

/*This function does not need to be edited.*/
router.get('/search/:category/:resource', function(req, res, next) {
	var resource = req.params.resource;
	var category = req.params.category;
	var params = new URLSearchParams();
	params.append('q', resource);
	params.append('type', category);
	makeAPIRequest(spotify_base_uri + '/search?' + params, res);
});

/*This function does not need to be edited.*/
router.get('/artist/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest(spotify_base_uri + '/artists/' + id, res);
});

/*This function does not need to be edited.*/
router.get('/artist-related-artists/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest(spotify_base_uri + '/artists/' + id + '/related-artists', res);
});

/*This function does not need to be edited.*/
router.get('/artist-albums/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest(spotify_base_uri + '/artists/' + id + '/albums', res);
});

/*This function does not need to be edited.*/
router.get('/artist-top-tracks/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest(spotify_base_uri + '/artists/' + id + '/top-tracks?country=US', res);
});

/*This function does not need to be edited.*/
router.get('/album/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest(spotify_base_uri + '/albums/' + id, res);
});

/*This function does not need to be edited.*/
router.get('/album-tracks/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest(spotify_base_uri + '/albums/' + id + '/tracks', res);
});

/*This function does not need to be edited.*/
router.get('/track/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest(spotify_base_uri + '/tracks/' + id, res);
});

/*This function does not need to be edited.*/
router.get('/track-audio-features/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest(spotify_base_uri + '/audio-features/' + id, res);
});

module.exports = router;
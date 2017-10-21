var fs = require('fs'); //file system
var keys = require("./keys.js");
var Twitter = require('twitter');
var imdb = require('imdb-api');
var request = require('request');
var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: keys.SPOT_CLIENT_ID,
  secret: keys.SPOT_CLIENT_SECRET,
});

var client = new Twitter({
    consumer_key: keys.TWIT_KEY,
    consumer_secret: keys.TWIT_SECRET,
    access_token_key: keys.AK_TOK,
    access_token_secret: keys.AK_TOK_SEC
});

var userCommand = process.argv[2];
var artName = process.argv[3];

doNext(userCommand,artName);

function doNext(uC, aN){
	switch(uC){
	case "spotify-this-song":
		fetchSpotify(aN);
	break;

	case "movie-this":
		fetchOMDB(aN);
	break;

	case 'my-tweets':
		fetchTwitter();
	break;

	case "do-what-it-says":
		fetchRandom();
	break;

	default:
	break;
	}
}



function fetchSpotify(song){
	var songName;

	//If a song WAS chosen, make it title case so spotify can find it in its database
	//If a song was not typed it, default to the song The Sign
	if (song != null){
		songName = song;
	}
	else {
		songName = "The Sign";
	}
	console.log("Searching for: " + songName);
	console.log("------------------------");


	//Get data from spotify API based on the query term (song name) typed in by the user
	spotify.search({ type: 'track', query: songName}, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }

        // artist
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        // song name
        console.log("Song Title: " + data.tracks.items[0].name);
        // preview URL
        console.log("Preview URL: " + data.tracks.items[0].preview_url);
        // album title
        console.log("Found On: " + data.tracks.items[0].album.name);
		
	});
}


function fetchOMDB(movieName){
	//If a movie was not typed it, default to the movie Mr. Nobody
	if (artName == null){
		movieName = "Mr. Nobody";
	}


	//Get data from OMDB API based on the query term (movie name) typed in by the user
	var requestURL = "http://www.omdbapi.com/?apikey=40e9cece&type=movie&t=" + movieName;

	request(requestURL, function (error, response, data){

		//if no error found console log output
		if (!error){
			console.log("Everything working fine.");
		}
		console.log("---------------------------------------------");
		console.log("The movie's title is: " + JSON.parse(data)["Title"]);
		console.log("The movie's release year is: " + JSON.parse(data)["Year"]);		
		console.log("The movie's rating is: " + JSON.parse(data)["imdbRating"]);
		console.log("The movie's Rotten Tomatoes Rating: " + JSON.parse(data)["tomatoRating"]);
		console.log("The movie's was produced in: " + JSON.parse(data)["Country"]);
		console.log("The movie's language is: " + JSON.parse(data)["Language"]);
		console.log("The movie's plot: " + JSON.parse(data)["Plot"]);
		console.log("The movie's actors: " + JSON.parse(data)["Actors"]);
										
	});
}

function fetchTwitter(){
			//Get data from Twitter API based on the screen name in this case NPR twitter
            return client.get('statuses/user_timeline', {
                screen_name: 'krothled1'
            }, function (error, tweets, response) {

                for (let i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].text);
                    console.log("");
                }

            });

}


function fetchRandom(){
	//LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
	//Runs `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
	fs.readFile("random.txt", 'utf8', function(err, data){

		// console.log(data);

		//Creating an array from a string with split()
		//Every comma, push the element into the array
		var dataArr = data.split(',');

		// console.log(dataArr);

		var randomUserCommand = dataArr[0];
		var randomArtName = dataArr[1];

		console.log("You requested to " + "<" + randomUserCommand + "> with " + randomArtName);
	
		//Remove the quotes before making a request
		randomArtName = randomArtName.replace(/^"(.*)"$/, '$1');

		doNext(randomUserCommand, randomArtName);
	});
}

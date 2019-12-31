require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var appCommand = process.argv[2];

var userSearch = process.argv.slice(3).join(" ");

function liriRun(appCommand, userSearch) {
    switch (appCommand) {
        case "spotify-this-song":
            getSpotify(userSearch);
            break;

        case "concert-this":
            getBandsInTown(userSearch);
            break;

        case "movie-this":
            getOMDB(userSearch);
            break;

        case "do-what-it-says":
            getRandom();
            break;

        default:
            console.log("Please enter one of the following commands:'concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'");
            break;

    }
};

//------Function to search Spotify API

function getSpotify(songName) {

    // Variables for spotify secret ids
    var spotify = new spotify(keys.spotify);
    console.log("Spotify key: " + spotify);

    if (!songName) {
        songName = "The Sign";
    };
    //console.log("SongName if not a song name: " + songName);

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        //add a line break
        console.log("----------------------------");
        //return Artist(s)
        console.log("Artist(s) Name:" + data.tracks.item[0].album.artists[0].name + "\r\n");
        //return The song's name
        console.log("Song Name: " + data.tracks.items[0].name + "\r\n");
        //return A preview link of the song from Spotify
        console.log("Song Preview Link: " + data.tracks.items[0].href + "\r\n");
        //return The album that the song is from 
        console.log("Album: " + data.tracks.item[0].album.name + "\r\n");

        //Append text into log.txt file
        var logSong = "==========Begin Spotify Log Entry==========" + "\nAritist: " + data.tracks.item[0].album.artists[0].name + "\r\n";

        fs.appendFile("log.txt", logSong, function (err) {
            if (err) throw err;
        });
        //logResults(data)
    });
};

//----------Function to search Bands In Town API
function getBandsInTown(artist) {
    var artist = userSearch;
    var bandQueryURL = "https://www.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    axios.get(bandQueryURL).then(
        function (response) {
            //add a line break
            console.log("----------------------------");
            //console.log(response);
            console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
            console.log("Venue Location: " + response.data[0].venue.city + "\r\n"); 
            console.log("Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\r\n");

            //Apprnd text into log.txt file
        var logConcert = "========Begin Concert Log Entry========" + "\nName of the musician:" + artist + "\nName of the venue" + venue.name + "\r\n";

        fs.appendFile("log.txt", logConcert, function (err) {
            if (err) throw err;
        });
            //logResults(response)  
    }); 
};
    
    

//---------- function to search OMDB API
function getOMDB(movie) {
    //console.log("Movie: " + movie);
    //if the user doesn't type a movie, program will output data for the movie 'Mr. Nobody.'
    if (!movie) {
        movie = "Mr. Nobody";
    }
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    //console.log(movieQueryUrl);

    axios.request(movieQueryUrl).then(
        function (response) {
            //consolelog (resoonse.data);
            //add a line break
            console.log("----------------------------");
            console.log("* Title: " + response.data.Title + "\r\n");
            console.log("* Year Released: " + response.data.Year + "\r\n");
            console.log("* IMDB Rating: " + response.data.imdbRating + "\r\n");
            console.log("* Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
            console.log("* Country Where Prouced: " + response.data.Country + "\r\n");
            console.log("* Language: " + response.data.Language + "\r\n");
            console.log("* Plot: " + response.data.Plot + "\r\n");
            console.log("* Actors: " + response.data.Actors + "\r\n");

            //logResults(response);
            var logMovie = "========Begin Movie Log Entry========" + "\nMovie title:" + response.data.Title + "\nYear released" + response.data.Year + "\r\n";

            fs.appendFile("log.txt", logMovie, function (err) {
                if (err) throw err;
            })
        }
    )
}

//FUNCTION RANDOM

function getRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);

        } else {
            console.log(data);

            var randomData = data.split(",");
            liriRun(randomData[0], randomData[1]);
        }

        //console.log("\r\n" + "testing:" + randomnData[0] + randomData[1]);
    });
};

//FUNCTION to log results from other functions
function logResults(data) {
    fs.appendFile("log.txt", data, function (err) {
        if (err) throw err;
    });
};


liriRun(appCommand, userSearch);



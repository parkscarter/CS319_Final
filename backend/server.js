//https://the-odds-api.com/liveapi/guides/v4/#overview
var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const port = "8081";
const host = "localhost";
const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const dbName = "final319";
const client = new MongoClient(url);
const db = client.db(dbName);

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});

let apikey = "900d1f183fb4804e64c67f9341640819";

const basketballUrl =
  "https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=" +
  apikey +
  "&bookmakers=draftkings&markets=spreads,h2h&oddsFormat=american";
const mmaUrl =
  "https://api.the-odds-api.com/v4/sports/mma_mixed_martial_arts/odds/?apiKey=" +
  apikey +
  "&bookmakers=unibet&markets=h2h&oddsFormat=american";
const mlsUrl =
  "https://api.the-odds-api.com/v4/sports/soccer_usa_mls/odds/?apiKey=" +
  apikey +
  "&bookmakers=draftkings&markets=h2h&oddsFormat=american";

var bbObjects;
var mlsObjects;
var mmaObjects;

fetch(basketballUrl)
  .then((response) => {
    // Check if the request was successful (status code 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the JSON in the response
    return response.json();
  })
  .then((data) => {
    // Log the JSON response
    bbObjects = data;
    //arrayOfObjects = JSON.parse(data)
  })
  .catch((error) => {
    // Log any errors that occurred during the fetch
    console.error("Fetch error:", error);
  });

fetch(mlsUrl)
  .then((response) => {
    // Check if the request was successful (status code 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the JSON in the response
    return response.json();
  })
  .then((data) => {
    // Log the JSON response
    mlsObjects = data;
    //arrayOfObjects = JSON.parse(data)
  })
  .catch((error) => {
    // Log any errors that occurred during the fetch
    console.error("Fetch error:", error);
  });

fetch(mmaUrl)
  .then((response) => {
    // Check if the request was successful (status code 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the JSON in the response
    return response.json();
  })
  .then((data) => {
    // Log the JSON response
    mmaObjects = data;
    //arrayOfObjects = JSON.parse(data)
  })
  .catch((error) => {
    // Log any errors that occurred during the fetch
    console.error("Fetch error:", error);
  });

// Endpoint to get NBA odds
app.get("/nba", (req, res) => {
  console.log("Hello");
  console.log(bbObjects);
  res.json(bbObjects);
});

// Endpoint to get MMA odds
app.get("/mma", (req, res) => {
  res.json(mmaObjects);
});

// Endpoint to get MLS odds
app.get("/mls", (req, res) => {
  res.json(mlsObjects);
});

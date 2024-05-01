//https://the-odds-api.com/liveapi/guides/v4/#overview

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
const champsUrl =
  "https://api.the-odds-api.com/v4/sports/soccer_uefa_european_championship/odds/?apiKey=" +
  apikey +
  "&bookmakers=draftkings&markets=spreads,h2h&oddsFormat=american";

var bbObjects;
var mlsObjects;
var champsObjects;
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
    console.log(bbObjects);
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
    console.log(mlsObjects);

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
    console.log(mmaObjects);

    //arrayOfObjects = JSON.parse(data)
  })
  .catch((error) => {
    // Log any errors that occurred during the fetch
    console.error("Fetch error:", error);
  });

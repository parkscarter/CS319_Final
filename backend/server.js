//https://the-odds-api.com/liveapi/guides/v4/#overview
var express = require("express");
var cors = require("cors");
var app = express();
var ObjectId = require("mongodb").ObjectId;
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

app.post("/bet", async (req, res) => {
  await client.connect();
  console.log("Request: POST BET");

  const newBet = req.body;
  const query = {
    teamBetOn: newBet.teamBetOn,
    teamBetAgainst: newBet.teamBetAgainst,
    timeOfGame: newBet.timeOfGame,
    betAmount: parseInt(newBet.betAmount),
    toWin: parseInt(newBet.toWin.toFixed(2)),
  };
  const result = await db.collection("bets").insertOne(query);

  if (!result) {
    res.send("Product was not added").status(404);
  } else {
    res.status(201).send(result);
  }
});

app.get("/bets", async (req, res) => {
  try {
    await client.connect();
    console.log("Request: GET BET");

    const bets = await db.collection("bets").find().toArray();

    if (!bets) {
      res.send("No bets found").status(404);
    } else {
      res.status(200).json(bets);
    }
  } catch (error) {
    console.error("Error fetching bets:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/bet/:id", async (req, res) => {
  try {
    await client.connect();
    console.log("Request: DELETE BET");

    const { id } = req.params;

    const result = await db
      .collection("bets")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.send("No bet found with that ID").status(404);
    } else {
      res.status(200).send("Bet deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting bet:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/bet/:id", async (req, res) => {
  try {
    await client.connect();
    console.log("Request: PUT BET");
    const { id } = req.params;
    console.log("Received ID:", id); // Log the received ID
    const updatedBet = req.body;
    console.log(updatedBet);

    updatedBet.betAmount = parseInt(updatedBet.betAmount) * 2;
    updatedBet.toWin = parseInt(updatedBet.toWin.toFixed(2)) * 2;

    // Exclude the _id field from the updated document
    delete updatedBet._id;

    const result = await db
      .collection("bets")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedBet });

    if (result.matchedCount === 0) {
      res.send("No bet found with that ID").status(404);
    } else {
      res.status(200).send("Bet updated successfully");
    }
  } catch (error) {
    console.error("Error updating bet:", error);
    res.status(500).send("Internal Server Error");
  }
});

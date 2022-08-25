'use strict'
const port = 8080;

const express = require('express');

const db = require("./database");
const utilities = require("./utilities");

// Object that implements the express server
const app = express();
app.use(express.json());

// All express queries log the url to console
app.use("/", utilities.printURL);

// If the request doesn't include a path, then default to the index.html page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

// index.html and any other client-side files should be served and executed locally.
app.get("/*", express.static("public"));

app.post("/addactivity", addActivity);

app.post("/deleteactivity", deleteActivity);

app.get("/getactivity", getActivity);

app.get("/getallactivities", getAllActivities);

app.get("/shutdown", (req, res) => {
  console.log("Shutdown request recieved");
  listener.close();
  db.close();
});

app.use(utilities.fileNotFound);

const listener = app.listen(port, () => {
  console.log("The server is listening on port " + port);
});


// Function definitions that are used above

async function addActivity(req, res) {
  const data = req.body;
  const activity = data.activity;
  const date = parseInt(data.date);
  const amount = parseFloat(data.amount);
  if (typeof(activity) == "string" && !isNaN(date) && !isNaN(amount)) {
    await db.postActivity(activity, date, amount);
    res.send({ message: "Activity added to database"});
  } else {
    console.log(typeof(activity), typeof(date), typeof(amount));
    res.send({ message: "Activity entered improperly, no changes made"});
  }
}

async function deleteActivity(req, res) {
  console.log(req.body);
  const rowIdNum = req.body.rowIdNum;
  await db.deleteActivity(rowIdNum);
  res.send({message: "Activity removed from database"});
}

async function getActivity(req, res) {
  const activity = req.query.activity;
  let response = await db.getActivity(activity);
  res.send(JSON.stringify(response));  
}

async function getAllActivities(req, res) {
  const activity = req.query.activity;
  let response = await db.getAllActivities(activity);
  res.send(JSON.stringify(response));
}



const request = require("supertest");
const assert = require("assert");
const express = require("express");

// You have been given an express server which has a few endpoints.
// Your task is to create a global middleware (app.use) which will
// maintain a count of the number of requests made to the server in the global
// requestCount variable

const app = express();
let requestCount = 0;
const port = 3000;

app.use((req, res, next) => {
  requestCount++;
  next();
});

app.get("/user", function (req, res) {
  res.status(200).json({ name: "john" });
});

app.post("/user", function (req, res) {
  res.status(200).json({ msg: "created dummy user" });
});

app.get("/requestCount", function (req, res) {
  res.status(200).json({ requestCount });
});

app.all("*", (req, res) => {
  res.status(404).json({ err: `Content not found` });
});

app.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});

module.exports = app;

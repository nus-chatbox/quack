const _ = require("lodash");
const express = require("express");
const config = require("../config/api-server");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Cross-site header configurations
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Authorization, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Authentication libraries
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJwt = require("passport-jwt");
app.use(passport.initialize());

const port = config.get("express.port");
const ip = config.get("express.ip");

app.listen("3000", "127.0.0.1", () => {
    console.log("Server started on port 3000");
});
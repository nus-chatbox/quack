const _ = require('lodash');
const express = require('express');
const config = require('../config/api-server');
const bodyParser = require('body-parser');
const nodeEnv = _.isEmpty(process.env.NODE_ENV) ? 'development' : process.env.NODE_ENV;

// Database libraries
const objection = require('objection');
const Model = objection.Model;
const Knex = require('knex');

// Initialize knex connection.
const knexConfiguration = require('./knexfile');
const knex = Knex(knexConfiguration[nodeEnv]);

// Give the connection to objection.
Model.knex(knex);
const User = require('./Models/user');
const Message = require('./Models/message');
const Room = require('./Models/room');
const Subscription = require('./Models/subscription');

const UserController = require('./Controllers/user');

const app = express();
app.use(bodyParser.json());

// Cross-site header configurations
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Authorization, Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Authentication libraries
const https = require("https");
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJwt = require('passport-jwt');
app.use(passport.initialize());

const fbClientId = config.get("authentication.facebook.clientId");
const fbClientSecret = config.get("authentication.facebook.clientSecret");

const generateUserToken = (userTokenSubject) => {
  const expiresIn = "7d";
  const issuer = config.get("authentication.token.issuer");
  const audience = config.get("authentication.token.audience");
  const secret = config.get("authentication.token.secret");

  let userToken = jwt.sign({}, secret, {
    expiresIn: expiresIn,
    audience: audience,
    issuer: issuer,
    subject: JSON.stringify(userTokenSubject)
  });
  return userToken;
};

const exchangeFbToken = (fbToken) => {
  let query = "?grant_type=fb_exchange_token" + 
              "&client_id=" + fbClientId + 
              "&client_secret=" + fbClientSecret + 
              "&fb_exchange_token=" + fbToken;

  return new Promise((resolve, reject) => {
    https.get("https://graph.facebook.com/oauth/access_token" + query, (res) => {
      if (res.statusCode !== 200) {
        reject("Got status code " + res.statuscode + " while exchanging fb token");
      } else {
        let responseData = "";
        res.on("data", (dataChunk) => {
          responseData = responseData + dataChunk;
        });
        res.on("end", () => {
          resolve(responseData);
        });
      }
    }).on("error", (err) => {
      reject(err);
    });
  });
};

app.post("/authenticate", (req, res) => {
  let fbToken = req.body.token;
  let fbDisplayName = req.body.name;
  let fbId = req.body.id;

  exchangeFbToken(fbToken).then((fbResponseJSON) => {
    let fbResponse = JSON.parse(fbResponseJSON);
    let newFbToken = fbResponse.access_token;

    let userPromise = UserController.findOrCreate({facebookId: fbId});
    userPromise.then((user) => {
      let userTokenSubject = {
        user: user,
        fbToken: newFbToken
      };

      let jwtToken = generateUserToken(userTokenSubject);
      res.json({
        token: jwtToken
      });
    });
  }).catch((err) => {
    res.json({
      token: null
    });
  });
});

const port = config.get('express.port');
const ip = config.get('express.ip');

app.listen(port, ip, () => {
  console.log('Server started on port ' + port);
});
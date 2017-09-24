const _ = require('lodash');
const express = require('express');
const config = require('../config/api-server');
const bodyParser = require('body-parser');
const nodeEnv = _.isEmpty(process.env.NODE_ENV) ? 'development' : process.env.NODE_ENV;

// Database libraries
const objection = require('objection');
const raw = objection.raw;
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

const app = express();
const port = config.get('express.port');
const ip = config.get('express.ip');
const server = app.listen(port, ip);
const io = require('socket.io')(server);

// Cross-site header configurations
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Authorization, Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.json());

// Authentication libraries
const https = require("https");
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJwt = require('passport-jwt');
app.use(passport.initialize());

const passportJWTOptions = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get("authentication.token.secret"),
  issuer: config.get("authentication.token.issuer"),
  audience: config.get("authentication.token.audience")
};

passport.use(new passportJwt.Strategy(passportJWTOptions, function(jwtPayload, done) {
    let user = JSON.parse(jwtPayload.sub).user;
    return done(null, user);
}));


/*********************** FB Authentication ****************************/

const fbClientId = config.get("authentication.facebook.clientId");
const fbClientSecret = config.get("authentication.facebook.clientSecret");

const httpsGet = (fullUrl) => {
  return new Promise((resolve, reject) => {
    https.get(fullUrl, (res) => {
      if (res.statusCode !== 200) {
        reject("Status code: " + res.statusCode + " for " + fullUrl);
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

const generateUserToken = (payload) => {
  const expiresIn = "7d";
  const issuer = config.get("authentication.token.issuer");
  const audience = config.get("authentication.token.audience");
  const secret = config.get("authentication.token.secret");

  let userToken = jwt.sign({}, secret, {
    expiresIn: expiresIn,
    audience: audience,
    issuer: issuer,
    subject: JSON.stringify(payload)
  });
  return userToken;
};

const exchangeFbToken = (fbToken) => {
  let fullUrl = "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token" + 
              "&client_id=" + fbClientId + 
              "&client_secret=" + fbClientSecret + 
              "&fb_exchange_token=" + fbToken;

  return httpsGet(fullUrl);
};

const getFBUser = (fbToken) => {
  let fullUrl = "https://graph.facebook.com/me?access_token=" + fbToken;
  return httpsGet(fullUrl);
};

app.post("/authenticate", (req, res) => {
  let fbToken = req.body.fbToken;

  exchangeFbToken(fbToken).then((fbResponseJSON) => {
    let fbResponse = JSON.parse(fbResponseJSON);
    let newFbToken = fbResponse.access_token;
    return newFbToken;
  }).then((newFbToken) => {
    return Promise.all([getFBUser(newFbToken), Promise.resolve(newFbToken)]);
  }).then((userAndToken) => {
    let user = JSON.parse(userAndToken[0]);
    let fbToken = userAndToken[1];

    let fbId = user.id;
    return Promise.all([User.findOrCreate({facebookId: fbId}), Promise.resolve(fbToken)]);
  }).then((userAndToken) => {
    let user = userAndToken[0];
    let fbToken = userAndToken[1];
    let payload = {
      user: user
    };
    let jwtToken = generateUserToken(payload);
    res.json({
      fbToken: fbToken,
      jwtToken: jwtToken
    });
  }).catch((err) => {
    console.error(err);
    res.json({
      token: null
    });
  });
});


/******************************* Rooms ********************************/

io.on('connect', function(socket) {
  socket.on('room', function(room) {
    socket.join(room);
  });
});

app.get("/rooms", passport.authenticate(["jwt"], { session: false }), (req, res) => {
  let userLatitude = req.user.latitude;
  let userLongitude = req.user.longitude;

  let nearbyRoomPromise = Room.query().select(
    raw("*, (6371 * acos(cos(radians(:userLatitude)) * " + 
                        "cos(radians(latitude)) * " + 
                        "cos(radians(longitude) - " + 
                            "radians(:userLongitude)) + " +
                        "sin(radians(:userLatitude)) * " +
                        "sin(radians(latitude)))) as distance", {
    userLatitude: userLatitude,
    userLongitude: userLongitude
  })).having("distance", "<=", 1).orderBy("distance", "asc");

  nearbyRoomPromise.then((rooms) => {
    res.json({
      rooms: rooms
    });
  });
});

app.get("/subscriptions", passport.authenticate(["jwt"], { session: false }), (req, res) => {
  let userId = req.user.id;
  let userSubscriptionPromise = User.query().eager('subscriptions').where('id', userId);
  userSubscriptionPromise.then((users) => {
    res.json({
      rooms: users[0].subscriptions
    });
  });
});

app.get("/rooms/:roomId/messages", passport.authenticate(["jwt"], { session: false }), (req, res) => {
  let roomId = Number(req.params.roomId);

  if (_.isNaN(roomId)) {
    res.json({
      messages: []
    });
    return;
  }

  let messagePromise = Message.query().where('roomId', roomId).then((messages) => {
    res.json({
      messages: messages
    });
  });
});

app.post("/rooms/:roomId/messages", passport.authenticate(["jwt"], { session: false }), (req, res) => {
  let userId = req.user.id;
  let roomId = Number(req.params.roomId);
  let text = req.body.text;

  if (_.isNaN(roomId)) {
    res.json({
      status: "error"
    });
    return;
  }

  let messagePromise = Message.create({
    userId: userId,
    attachmentType: 'text',
    roomId: roomId,
    text: text
  });

  messagePromise.then((message) => {
    io.to(`${roomId}`).emit('message', message);
    res.json({
      status: "success",
      message: message
    });
  }).catch((err) => {
    res.json({
      status: "error"
    });
  });
});


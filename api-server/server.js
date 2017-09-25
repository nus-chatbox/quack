/* eslint-disable arrow-body-style */
/* eslint-disable import/newline-after-import */
/* eslint-disable newline-per-chained-call */
/* eslint-disable spaced-comment */
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
const https = require('https');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJwt = require('passport-jwt');
app.use(passport.initialize());

const passportJWTOptions = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('authentication.token.secret'),
  issuer: config.get('authentication.token.issuer'),
  audience: config.get('authentication.token.audience')
};

passport.use(new passportJwt.Strategy(passportJWTOptions, (jwtPayload, done) => {
  const user = JSON.parse(jwtPayload.sub).user;
  return done(null, user);
}));


/*********************** FB Authentication ****************************/

const fbClientId = config.get('authentication.facebook.clientId');
const fbClientSecret = config.get('authentication.facebook.clientSecret');

const httpsGet = (fullUrl) => {
  return new Promise((resolve, reject) => {
    https.get(fullUrl, (res) => {
      if (res.statusCode !== 200) {
        reject(`Status code: ${res.statusCode} for ${fullUrl}`);
      } else {
        let responseData = '';
        res.on('data', (dataChunk) => {
          responseData += dataChunk;
        });
        res.on('end', () => {
          resolve(responseData);
        });
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const generateUserToken = (payload) => {
  const expiresIn = '7d';
  const issuer = config.get('authentication.token.issuer');
  const audience = config.get('authentication.token.audience');
  const secret = config.get('authentication.token.secret');

  const userToken = jwt.sign({}, secret, {
    expiresIn,
    audience,
    issuer,
    subject: JSON.stringify(payload)
  });
  return userToken;
};

const exchangeFbToken = (fbToken) => {
  const fullUrl = `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token\
&client_id=${fbClientId}&client_secret=${fbClientSecret}&fb_exchange_token=${fbToken}`;

  return httpsGet(fullUrl);
};

const getFBUser = (fbToken) => {
  const fullUrl = `https://graph.facebook.com/me?access_token=${fbToken}`;
  return httpsGet(fullUrl);
};

app.post('/authenticate', (req, res) => {
  const oldFbToken = req.body.fbToken;

  exchangeFbToken(oldFbToken).then((fbResponseJSON) => {
    const fbResponse = JSON.parse(fbResponseJSON);
    const newFbToken = fbResponse.access_token;
    return newFbToken;
  }).then((newFbToken) => {
    return Promise.all([getFBUser(newFbToken), Promise.resolve(newFbToken)]);
  }).then((userAndToken) => {
    const user = JSON.parse(userAndToken[0]);
    const fbToken = userAndToken[1];

    const fbId = user.id;
    return Promise.all([User.findOrCreate({ facebookId: fbId }), Promise.resolve(fbToken)]);
  }).then((userAndToken) => {
    const user = userAndToken[0];
    const fbToken = userAndToken[1];
    const payload = {
      user
    };
    const jwtToken = generateUserToken(payload);
    res.json({
      fbToken,
      jwtToken
    });
  }).catch(() => {
    res.json({
      token: null
    });
  });
});


/******************************* Rooms ********************************/

io.on('connect', (socket) => {
  socket.on('room', (room) => {
    socket.join(room);
  });
});

app.get('/rooms', passport.authenticate(['jwt'], { session: false }), (req, res) => {
  const userLatitude = req.user.latitude;
  const userLongitude = req.user.longitude;

  const nearbyRoomPromise = Room.query().select(
    raw(`*, (6371 * acos(cos(radians(:userLatitude)) * \
                         cos(radians(latitude)) * \
                         cos(radians(longitude) - \
                             radians(:userLongitude)) + \
                         sin(radians(:userLatitude)) * \
                         sin(radians(latitude)))) as distance`, {
    userLatitude,
    userLongitude
  })).having('distance', '<=', 1).orderBy('distance', 'asc');

  nearbyRoomPromise.then((rooms) => {
    res.json({
      rooms
    });
  });
});

app.get('/subscriptions', passport.authenticate(['jwt'], { session: false }), (req, res) => {
  const userId = req.user.id;
  const userSubscriptionPromise = User.query().eager('subscriptions').where('id', userId);
  userSubscriptionPromise.then((users) => {
    res.json({
      rooms: users[0].subscriptions
    });
  });
});

app.get('/rooms/:roomId/messages', passport.authenticate(['jwt'], { session: false }), (req, res) => {
  const roomId = Number(req.params.roomId);

  if (_.isNaN(roomId)) {
    res.json({
      messages: []
    });
    return;
  }

  Message.query().where('roomId', roomId).then((messages) => {
    res.json({
      messages
    });
  });
});

app.post('/rooms/:roomId/messages', passport.authenticate(['jwt'], { session: false }), (req, res) => {
  const userId = req.user.id;
  const roomId = Number(req.params.roomId);
  const text = req.body.text;

  if (_.isNaN(roomId)) {
    res.json({
      status: 'error'
    });
    return;
  }

  const messagePromise = Message.create({
    userId,
    attachmentType: 'text',
    roomId,
    text
  });

  messagePromise.then((message) => {
    io.to(`${roomId}`).emit('message', message);
    res.json({
      status: 'success',
      message
    });
  }).catch(() => {
    res.json({
      status: 'error'
    });
  });
});


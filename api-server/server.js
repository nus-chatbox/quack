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
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
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

  if (_.isEmpty(oldFbToken)) {
    res.status(400).send({
      status: 400,
      message: 'FB client access token not found in request body',
      token: null
    });
    return;
  }

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
    const displayName = user.name;
    return Promise.all([
      User.findOrCreate({
        facebookId: fbId,
        displayName
      }),
      Promise.resolve(fbToken)
    ]);
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
    res.status(500).send({
      status: 500,
      message: 'An error occurred with processing your request',
      token: null
    });
  });
});

/******************************* Users ********************************/

app.patch('/users', passport.authenticate(['jwt'], { session: false }), (req, res) => {
  const id = req.user.id;
  const updatedDisplayName = req.body.displayName;
  const updatedUserLatitude = Number(req.body.latitude);
  const updatedUserLongitude = Number(req.body.longitude);

  if (_.isNaN(updatedUserLatitude) && _.isNaN(updatedUserLongitude) && _.isEmpty(updatedDisplayName)) {
    res.status(400).send({
      status: 400,
      message: 'Invalid user geolocation or missing displayName in request body'
    });
    return;
  }

  const patchObject = {};
  if (!_.isNaN(updatedUserLatitude)) {
    patchObject.latitude = updatedUserLatitude;
  }
  if (!_.isNaN(updatedUserLongitude)) {
    patchObject.longitude = updatedUserLongitude;
  }
  if (!_.isEmpty(updatedDisplayName)) {
    patchObject.displayName = updatedDisplayName;
  }

  User.query().patch(patchObject).where('id', id).then((updateCount) => {
    return User.query().where('id', id);
  }).then((users) => {
    const payload = {
      user: users[0]
    };
    const jwtToken = generateUserToken(payload);
    res.json({
      jwtToken
    });
  }).catch((err) => {
    res.status(500).send({
      status: 500,
      message: 'An error occurred with processing your request'
    });
  });
});

/******************************* Rooms ********************************/

io.on('connect', (socket) => {
  socket.on('subscribe', (rooms) => {
    rooms.forEach((room) => {
      socket.join(room);
    });
  });
  socket.on('unsubscribe', (rooms) => {
    rooms.forEach((room) => {
      socket.leave(room);
    });
  });
});

app.get('/rooms', passport.authenticate(['jwt'], { session: false }), (req, res) => {
  const userLatitude = req.user.latitude;
  const userLongitude = req.user.longitude;

  if (_.isNaN(userLatitude) || _.isNaN(userLongitude)) {
    res.status(400).send({
      status: 400,
      message: 'invalid user geolocation, try refreshing your chat'
    });
    return;
  }

  const nearbyRoomPromise = Room.query().select(
    raw(`*, (6371000 * acos(cos(radians(:userLatitude)) * \
                         cos(radians(latitude)) * \
                         cos(radians(longitude) - \
                             radians(:userLongitude)) + \
                         sin(radians(:userLatitude)) * \
                         sin(radians(latitude)))) as distance`, {
    userLatitude,
    userLongitude
  })).having('distance', '<=', 100).orderBy('distance', 'asc');

  nearbyRoomPromise.then((rooms) => {
    const roomsWithLastMessagePromise = rooms.map((room) => {
      return Promise.all([
        Promise.resolve(room),
        Message.query().eager('owner').where('roomId', room.id).orderBy('id', 'desc').first()
      ]);
    });
    return Promise.all(roomsWithLastMessagePromise);
  }).then((pairsOfRoomWithLastMessage) => {
    let rooms = [];
    pairsOfRoomWithLastMessage.forEach((pairOfRoomWithLastMessage) => {
      let room = pairOfRoomWithLastMessage[0];
      let message = pairOfRoomWithLastMessage[1];

      if (message !== undefined) {
        const lastMessageOwner = message.owner;
        message.owner = {
          id: lastMessageOwner.id,
          displayName: lastMessageOwner.displayName,
          latitude: lastMessageOwner.latitude,
          longitude: lastMessageOwner.longitude
        };
      }

      room.messages = message === undefined ? [] : [message];
      rooms.push(room);
    });

    res.json({
      rooms
    });
  }).catch((err) => {
    res.status(500).send({
      status: 500,
      message: 'An error occurred with processing your request',
      rooms: null
    });
  });
});

app.get('/rooms/:roomId', (req, res) => {
  Room.query().where('id', req.params.roomId).then((rooms) => {
    res.json({
      rooms
    });
  }).catch((err) => {
    res.status(500).send({
      status: 500,
      message: 'An error occurred with processing your request',
      rooms: null
    });
  });
});

app.post('/rooms', passport.authenticate(['jwt'], { session: false }), (req, res) => {
  const ownerId = req.user.id;
  const latitude = Number(req.user.latitude);
  const longitude = Number(req.user.longitude);
  const title = req.body.title;

  if (_.isNaN(latitude) || _.isNaN(longitude)) {
    res.status(400).send({
      status: 400,
      message: 'invalid user geolocation, try refreshing your chat'
    });
    return;
  }

  if (_.isEmpty(title)) {
    res.status(400).send({
      status: 400,
      message: 'Title not found in request body'
    });
    return;
  }

  const roomPromise = Room.create({
    ownerId,
    latitude,
    longitude,
    title
  });

  roomPromise.then((room) => {
    res.json({
      status: 'success',
      room
    });
  }).catch(() => {
    res.status(500).send({
      status: 500,
      message: 'An error occurred with processing your request',
      room: null
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
  }).catch((err) => {
    res.status(500).send({
      status: 500,
      message: 'An error occurred with processing your request'
    });
  });
});

app.get('/rooms/:roomId/messages', passport.authenticate(['jwt'], { session: false }), (req, res) => {
  const roomId = Number(req.params.roomId);

  if (_.isNaN(roomId)) {
    res.status(400).send({
      status: 400,
      message: 'roomId not found in request parameter',
      messages: []
    });
    return;
  }

  Message.query().eager('owner').where('roomId', roomId).then((messages) => {
    messages.forEach((message) => {
      message.owner = {
        id: message.owner.id,
        displayName: message.owner.displayName,
        latitude: message.owner.latitude,
        longitude: message.owner.longitude
      };
    });
    res.json({
      messages
    });
  }).catch((err) => {
    res.status(500).send({
      status: 500,
      message: 'An error occurred with processing your request'
    });
  });
});

app.post('/rooms/:roomId/messages', passport.authenticate(['jwt'], { session: false }), (req, res) => {
  const userId = req.user.id;
  const roomId = Number(req.params.roomId);
  const text = req.body.text;

  if (_.isNaN(roomId)) {
    res.status(400).send({
      status: 400,
      message: 'Invalid roomId found in request body'
    });
    return;
  }

  if (_.isEmpty(text)) {
    res.status(400).send({
      status: 400,
      message: 'Message text cannot be empty'
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
    return Promise.all([
      User.query().where('id', message.userId),
      Promise.resolve(message)
    ]);
  }).then((userAndMessage) => {
    const user = userAndMessage[0][0];
    const message = userAndMessage[1];
    message.owner = {
      id: user.id,
      displayName: user.displayName,
      latitude: user.latitude,
      longitude: user.longitude
    };
    io.to(`${roomId}`).emit('message', message);
    res.json({
      status: 'success',
      message
    });
  }).catch(() => {
    res.status(500).send({
      status: 500,
      message: 'An error occurred with processing your request'
    });
  });
});


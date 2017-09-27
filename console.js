const repl = require('repl');
const r = repl.start('> ');

r.context._ = require('lodash');
r.context.express = require('express');
r.context.config = require('./config/api-server');
r.context.bodyParser = require('body-parser');
r.context.nodeEnv = 'development';

// Database libraries
r.context.objection = require('objection');
r.context.raw = r.context.objection.raw;
r.context.Model = r.context.objection.Model;
r.context.Knex = require('knex');

// Initialize knex connection.
r.context.knexConfiguration = require('./api-server/knexfile');
r.context.knex = r.context.Knex(r.context.knexConfiguration[r.context.nodeEnv]);

// Give the connection to objection.
r.context.Model.knex(r.context.knex);
r.context.User = require('./api-server/Models/user');
r.context.Message = require('./api-server/Models/message');
r.context.Room = require('./api-server/Models/room');
r.context.Subscription = require('./api-server/Models/subscription');

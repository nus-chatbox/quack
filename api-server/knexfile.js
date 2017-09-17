// Update with your config settings.
const config = require('../config/api-server');

const knexfile = {
  development: {
    dialect: 'mysql2',
    connection: {
      host: '127.0.0.1',
      user: 'quackdbuserdev',
      password: 'quackdbpassworddev',
      database: 'quackdbdev'
    }
  },
  staging: {
    dialect: 'mysql2',
    connection: {
      host: config.get('database.staging.host'),
      user: config.get('database.staging.user'),
      password: config.get('database.staging.password'),
      database: config.get('database.staging.name')
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'mysql2',
    connection: {
      host: config.get('database.production.host'),
      user: config.get('database.production.user'),
      password: config.get('database.production.password'),
      database: config.get('database.production.name')
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};

module.exports = knexfile;

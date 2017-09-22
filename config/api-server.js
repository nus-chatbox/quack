const convict = require('convict');

const config = convict({
  express: {
    port: {
      doc: 'The port to listen on',
      default: 3001,
      env: 'PORT'
    },
    ip: {
      doc: 'The ip to listen on',
      default: '127.0.0.1',
      env: 'IP'
    }
  },
  authentication: {
    facebook: {
      clientId: {
        doc: 'The Client ID from Facebook to use for authentication',
        default: '',
        env: 'FACEBOOK_CLIENT_ID'
      },
      clientSecret: {
        doc: 'The Client Secret from Facebook to use for authentication',
        default: '',
        env: 'FACEBOOK_CLIENT_SECRET'
      }
    },
    token: {
      secret: {
        doc: 'The signing key for the JWT',
        default: 'jwtsecretkey',
        env: 'JWT_SIGNING_KEY'
      },
      issuer: {
        doc: 'The issuer for the JWT',
        default: 'api.quack.press'
      },
      audience: {
        doc: 'The audience for the JWT',
        default: 'www.quack.press'
      }
    }
  },
  database: {
    staging: {
      name: {
        doc: 'The name of the stagingdatabase',
        default: 'quackdbstaging',
        env: 'QUACK_DB_STAGING_NAME'
      },
      port: {
        doc: 'The port to listen to',
        default: 3306,
        env: 'QUACK_DB_STAGING_PORT'
      },
      host: {
        doc: 'The host to listen to',
        default: '127.0.0.1',
        env: 'QUACK_DB_STAGING_HOST'
      },
      user: {
        doc: 'The user for staging database login',
        default: 'quackdbuserstaging',
        env: 'QUACK_DB_STAGING_USER'
      },
      password: {
        doc: 'The password for staging database login',
        default: 'quackdbpasswordstaging',
        env: 'QUACK_DB_STAGING_PASSWORD'
      }
    },
    production: {
      name: {
        doc: 'The name of the production database',
        default: 'quackdb',
        env: 'QUACK_DB_NAME'
      },
      port: {
        doc: 'The port to listen to',
        default: 3306,
        env: 'QUACK_DB_PORT'
      },
      host: {
        doc: 'The host to listen to',
        default: '127.0.0.1',
        env: 'QUACK_DB_HOST'
      },
      user: {
        doc: 'The user for production database login',
        default: 'quackdbuser',
        env: 'QUACK_DB_USER'
      },
      password: {
        doc: 'The password for production database login',
        default: 'quackdbpassword',
        env: 'QUACK_DB_PASSWORD'
      }
    }
  }
});

config.validate();

module.exports = config;

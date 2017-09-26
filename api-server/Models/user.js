/* eslint-disable arrow-body-style */
/* eslint-disable spaced-comment */
/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const Model = require('objection').Model;

class User extends Model {

  /******************************* Fields ********************************/

  // Table name is the only required property.
  static get tableName() {
    return 'users';
  }

  static get fields() {
    return _.keys(User.jsonSchema.properties);
  }

  // For validation only
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'facebookId'],
      properties: {
        id: {
          type: 'integer'
        },
        facebookId: {
          type: 'string'
        },
        displayName: {
          type: 'string'
        },
        latitude: {
          type: 'number'
        },
        longitude: {
          type: 'number'
        }
      }
    };
  }

  static get relationMappings() {
    return {
      messages: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/message.js`,
        join: {
          from: 'users.id',
          to: 'messages.userId'
        }
      },
      subscriptions: {
        relation: Model.ManyToManyRelation,
        modelClass: `${__dirname}/room.js`,
        join: {
          from: 'users.id',
          through: {
            from: 'subscriptions.userId',
            to: 'subscriptions.roomId'
          },
          to: 'rooms.id'
        }
      },
      rooms: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/room.js`,
        join: {
          from: 'users.id',
          to: 'rooms.ownerId'
        }
      }
    };
  }

  /*************************** Public Methods ****************************/

  // Returns a Promise that resolves to the foundOrCreated User
  static findOrCreate(userAttributes) {
    // Validation
    if (!User._isValidAttributes(userAttributes)) {
      return Promise.reject(`User.findOrCreate expects: ${User._requiredFields(userAttributes)}`);
    }

    // Try to find user, create if not found
    const user = User._construct(userAttributes);
    const userPromise = User.query().where('facebookId', userAttributes.facebookId).then((users) => {
      let returnedUser = null;
      if (_.isEmpty(users)) {
        returnedUser = User.query().insert(user);
      } else {
        returnedUser = Promise.resolve(users[0]);
      }
      return returnedUser;
    }).catch((err) => {
      return Promise.reject(err);
    });

    return userPromise;
  }

  /*************************** Private Methods ***************************/

  // This method wraps the User plain constructor by mutating a vanilla User
  // This allows us to avoid mutating the constructor, itself
  static _construct(userAttributes) {
    const user = new User();
    const writableFields = _.filter(User.fields, (userField) => {
      return userField !== 'id';
    });
    _.forEach(writableFields, (writableField) => {
      user[writableField] = userAttributes[writableField];
    });
    return user;
  }

  static _requiredFields(userAttributes) {
    return ['facebookId'];
  }

  static _isValidAttributes(userAttributes) {
    const requiredFields = User._requiredFields(userAttributes);
    const missingFields = _.filter(requiredFields, (requiredField) => {
      return _.isNil(userAttributes) || _.isNil(userAttributes[requiredField]);
    });

    return missingFields.length === 0;
  }
}

module.exports = User;

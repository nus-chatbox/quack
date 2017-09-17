const Model = require('objection').Model;

class User extends Model {

  // Table name is the only required property.
  static get tableName() {
    return 'users';
  }

  // Returns a Promise that resolves to the foundOrCreated User
  static findOrCreate(userAttributes) {
    // Validation
    let requiredFields =  ['facebookId'];
    let missingFields = _.filter(requiredFields, (requiredField) => {
      return _.isEmpty(userAttributes) || _.isEmpty(userAttributes[requiredField]);
    });

    if (missingFields.length > 0) {
      return Promise.reject("User.findOrCreate expects: " + missingFields.toString());
    }

    // Try to find user, create if not found
    let user = User.construct_(userAttributes);
    let userPromise = User.query().where('facebookId', userAttributes.facebookId).then((users) => {
      if (_.isEmpty(users)) {
        return User.query().insert(user);
      } else {
        let foundUser = users[0];
        return Promise.resolve(foundUser);
      }
    }).catch((err) => {
      return Promise.reject(err);
    });
    
    return userPromise;
  }

  // This method wraps the User plain constructor by mutating a vanilla User
  // This allows us to avoid mutating the constructor, itself
  static construct_(userAttributes) {
    let user = new User();
    let writableFields = _.filter(User.fields, (userField) => {
      return userField !== 'id';
    });
    _.forEach(writableFields, (writableField) => {
      user[writableField] = userAttributes[writableField];
    });
    return user;
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
          type: 'string'
        },
        longitude: {
          type: 'string'
        }
      }
    };
  }

  static get relationMappings() {
    return {
      messages: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/message.js',
        join: {
          from: 'users.id',
          to: 'messages.userId'
        }
      },
      subscriptions: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + '/room.js',
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
        modelClass: __dirname + '/room.js',
        join: {
          from: 'users.id',
          to: 'rooms.ownerId'
        }
      }
    };
  }
}

module.exports = User;
const Model = require('objection').Model;

class User extends Model {

  // Table name is the only required property.
  static get tableName() {
    return 'users';
  }

  static create(userAttributes) {
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
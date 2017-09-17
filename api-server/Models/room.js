const Model = require('objection').Model;

class Room extends User {
  // Table name is the only required property.
  static get tableName() {
    return 'rooms';
  }

  // For validation only
  static get jsonSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        id: {
          type: 'integer'
        },
        ownerId: {
          type: 'integer'
        },
        title: {
          type: 'string'
        },
        photoUrl: {
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
  };

  static get relationMappings() {
    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/user',
        join: {
          from: 'rooms.ownerId',
          to: 'users.id'
        }
      },
      messages: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + '/message',
        join: {
          from: 'rooms.id',
          to: 'messages.roomId'
        }
      },
      subscribers: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + '/user',
        join: {
          from: 'rooms.id',
          through: {
            from: 'subscriptions.roomId',
            to: 'subscriptions.userId'
          },
          to: 'user.id'
        }
      }
    };
  }
}

module.exports = Room;
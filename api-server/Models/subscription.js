const Model = require('objection').Model;

class Subscription extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'subscriptions';
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
        userId: {
          type: 'integer'
        },
        roomId: {
          type: 'integer'
        }
      }
    };
  };

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/user',
        join: {
          from: 'subscriptions.userId',
          to: 'users.id'
        }
      },
      room: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/room',
        join: {
          from: 'subscriptions.roomId',
          to: 'rooms.id'
        }
      }
    };
  }
}

module.exports = Subscription;
const Model = require('objection').Model;

class Message extends User {
  // Table name is the only required property.
  static get tableName() {
    return 'messages';
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
        attachmentUrl: {
          type: 'string'
        },
        attachmentType: {
          type: 'string'
        },
        text: {
          type: 'string'
        },
        roomId: {
          type: 'integer'
        }
      }
    };
  };

  static get relationMappings() {
    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/user.js',
        join: {
          from: 'messages.userId',
          to: 'users.id'
        }
      },
      room: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + '/room.js',
        join: {
          from: 'messages.roomId',
          to: 'rooms.id'
        }
      }
    };
  }
}

module.exports = Message;
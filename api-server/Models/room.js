/* eslint-disable arrow-body-style */
/* eslint-disable spaced-comment */
/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const Model = require('objection').Model;

class Room extends Model {

  /******************************* Fields ********************************/

  // Table name is the only required property.
  static get tableName() {
    return 'rooms';
  }

  static get fields() {
    return _.keys(Room.jsonSchema.properties);
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
  }

  static get relationMappings() {
    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/user.js`,
        join: {
          from: 'rooms.ownerId',
          to: 'users.id'
        }
      },
      messages: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/message.js`,
        join: {
          from: 'rooms.id',
          to: 'messages.roomId'
        }
      },
      subscribers: {
        relation: Model.ManyToManyRelation,
        modelClass: `${__dirname}/user.js`,
        join: {
          from: 'rooms.id',
          through: {
            from: 'subscriptions.roomId',
            to: 'subscriptions.userId'
          },
          to: 'users.id'
        }
      }
    };
  }

  /*************************** Public Methods ****************************/

  // Returns a Promise that resolves to the foundOrCreated User
  static create(roomAttributes) {
    // Validation
    if (!Room._isValidAttributes(roomAttributes)) {
      return Promise.reject(`Room.create expects: ${Room._requiredFields(roomAttributes)}`);
    }

    // Try to find user, create if not found
    const room = new Room();
    const writableFields = _.filter(Room.fields, (roomField) => {
      return roomField !== 'id';
    });
    _.forEach(writableFields, (writableField) => {
      room[writableField] = roomAttributes[writableField];
    });

    return Room.query().insert(room);
  }

  /*************************** Private Methods ***************************/

  static _requiredFields(roomAttributes) {
    return ['ownerId', 'latitude', 'longitude'];
  }

  static _isValidAttributes(roomAttributes) {
    const requiredFields = Room._requiredFields(roomAttributes);
    const missingFields = _.filter(requiredFields, (requiredField) => {
      return _.isNil(roomAttributes) || _.isNil(roomAttributes[requiredField]);
    });

    return missingFields.length === 0;
  }
}

module.exports = Room;

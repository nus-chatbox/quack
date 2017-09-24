/* eslint-disable arrow-body-style */
/* eslint-disable spaced-comment */
/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const Model = require('objection').Model;

class Message extends Model {

  /******************************* Fields ********************************/

  // Table name is the only required property.
  static get tableName() {
    return 'messages';
  }

  static get fields() {
    return _.keys(Message.jsonSchema.properties);
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
  }

  static get relationMappings() {
    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/user.js`,
        join: {
          from: 'messages.userId',
          to: 'users.id'
        }
      },
      room: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/room.js`,
        join: {
          from: 'messages.roomId',
          to: 'rooms.id'
        }
      }
    };
  }

  /*************************** Public Methods ****************************/

  // Returns a Promise that resolves to the foundOrCreated User
  static create(messageAttributes) {
    // Validation
    if (!Message._isValidAttributes(messageAttributes)) {
      return Promise.reject(`Message.create expects: ${Message._requiredFields(messageAttributes)}`);
    }

    // Try to find user, create if not found
    const message = new Message();
    const writableFields = _.filter(Message.fields, (messageField) => {
      return messageField !== 'id';
    });
    _.forEach(writableFields, (writableField) => {
      message[writableField] = messageAttributes[writableField];
    });

    return Message.query().insert(message);
  }

  /*************************** Private Methods ***************************/

  // Determines attachmentType given messageAttributes
  static _attachmentType(messageAttributes) {
    let attachmentType = 'text';
    if (!_.isNil(messageAttributes) && messageAttributes.attachmentType === 'image') {
      attachmentType = 'image';
    }
    return attachmentType;
  }

  static _requiredFields(messageAttributes) {
    const requiredFields = ['userId', 'attachmentType', 'roomId'];
    if (Message._attachmentType === 'image') {
      requiredFields.push('attachmentUrl');
    } else {
      requiredFields.push('text');
    }
    return requiredFields;
  }

  static _isValidAttributes(messageAttributes) {
    const requiredFields = Message._requiredFields(messageAttributes);
    const missingFields = _.filter(requiredFields, (requiredField) => {
      return _.isNil(messageAttributes) || _.isNil(messageAttributes[requiredField]);
    });

    return missingFields.length === 0;
  }
}

module.exports = Message;

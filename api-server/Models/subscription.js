/* eslint-disable arrow-body-style */
/* eslint-disable spaced-comment */
/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const Model = require('objection').Model;

class Subscription extends Model {

  /******************************* Fields ********************************/

  // Table name is the only required property.
  static get tableName() {
    return 'subscriptions';
  }

  static get fields() {
    return _.keys(Subscription.jsonSchema.properties);
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
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/user.js`,
        join: {
          from: 'subscriptions.userId',
          to: 'users.id'
        }
      },
      room: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/room.js`,
        join: {
          from: 'subscriptions.roomId',
          to: 'rooms.id'
        }
      }
    };
  }

  /*************************** Public Methods ****************************/

  // Returns a Promise that resolves to the foundOrCreated User
  static create(subscriptionAttributes) {
    // Validation
    if (!Subscription._isValidAttributes(subscriptionAttributes)) {
      return Promise.reject(`Subscription.create expects: ${Subscription._requiredFields(subscriptionAttributes)}`);
    }

    // Try to find user, create if not found
    const subscription = new Subscription();
    const writableFields = _.filter(Subscription.fields, (subscriptionField) => {
      return subscriptionField !== 'id';
    });
    _.forEach(writableFields, (writableField) => {
      subscription[writableField] = subscriptionAttributes[writableField];
    });

    return Subscription.query().insert(subscription);
  }

  /*************************** Private Methods ***************************/

  static _requiredFields(subscriptionAttributes) {
    return ['userId', 'roomId'];
  }

  static _isValidAttributes(subscriptionAttributes) {
    const requiredFields = Subscription._requiredFields(subscriptionAttributes);
    const missingFields = _.filter(requiredFields, (requiredField) => {
      return _.isNil(subscriptionAttributes) || _.isNil(subscriptionAttributes[requiredField]);
    });

    return missingFields.length === 0;
  }
}

module.exports = Subscription;

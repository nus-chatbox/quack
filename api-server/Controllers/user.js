const _ = require('lodash');
const User = require('../Models/user');

class UserController {
  static findOrCreate(userAttributes) {
    // Validation
    let requiredFields =  ['facebookId'];
    let missingFields = _.filter(requiredFields, (requiredField) => {
      return _.isEmpty(userAttributes) || _.isEmpty(userAttributes[requiredField]);
    });

    if (missingFields.length > 0) {
      return Promise.reject("UserController.findOrCreate expects: " + missingFields.toString());
    }

    // Try to find user, create if not found
    let user = User.create(userAttributes);
    let userPromise = User.query().where('facebookId', userAttributes.facebookId).then((users) => {
      if (_.isEmpty(users)) {
        return User.query().insert(user);
      } else {
        let foundUser = users[0];
        return Promise.resolve(foundUser);
      }
    });
    
    return userPromise;
  }
}

module.exports = UserController;
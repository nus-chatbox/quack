
exports.up = (knex, Promise) => {
  let createUserTablePromise = knex.schema.createTableIfNotExists('users', (table) => {
    table.increments();
    table.string('facebookId');
    table.string('displayName');
    table.string('latitude');
    table.string('longitude');
    table.timestamps(false, true);
  });

  return createUserTablePromise;
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};


exports.up = function(knex, Promise) {
  let createSubscriptionTablePromise = knex.schema.createTableIfNotExists('subscriptions', (table) => {
    table.increments();
    table.integer('userId').unsigned()
    table.foreign('userId').references('users.id');
    table.integer('roomId').unsigned()
    table.foreign('roomId').references('rooms.id');
    table.timestamps(false, true);
  });

  return createSubscriptionTablePromise;
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('subscriptions');
};

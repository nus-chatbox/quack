
exports.up = function(knex, Promise) {
  let createRoomsTablePromise = knex.schema.createTableIfNotExists('rooms', (table) => {
    table.increments();
    table.integer('ownerId').unsigned()
    table.foreign('ownerId').references('users.id');
    table.string('title');
    table.string('photoUrl');
    table.string('latitude');
    table.string('longitude');
    table.timestamps(false, true);
  });

  return createRoomsTablePromise;
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('rooms');
};


exports.up = function(knex, Promise) {
  let alterUserTablePromise = knex.schema.alterTable('users', (table) => {
    table.decimal('latitude', 10, 6).alter();
    table.decimal('longitude', 10, 6).alter();
  });
  let alterRoomTablePromise = knex.schema.alterTable('rooms', (table) => {
    table.decimal('latitude', 10, 6).alter();
    table.decimal('longitude', 10, 6).alter();
  });
  return Promise.all([alterUserTablePromise, alterRoomTablePromise]);
};

exports.down = function(knex, Promise) {
  let alterUserTablePromise = knex.schema.alterTable('users', (table) => {
    table.string('latitude').alter();
    table.string('longitude').alter();
  });
  let alterRoomTablePromise = knex.schema.alterTable('rooms', (table) => {
    table.string('latitude').alter();
    table.string('longitude').alter();
  });
  return Promise.all([alterUserTablePromise, alterRoomTablePromise]);
};

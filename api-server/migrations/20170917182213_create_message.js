
exports.up = (knex, Promise) => {
  let createMessagesTablePromise = knex.schema.createTableIfNotExists('messages', (table) => {
    table.increments();
    table.integer('userId').unsigned()
    table.foreign('userId').references('users.id');
    table.integer('roomId').unsigned();
    table.foreign('roomId').references('rooms.id');
    table.string('attachmentUrl');
    table.string('attachmentType');
    table.text('text');
    table.timestamps(false, true);
  });

  return createMessagesTablePromise;
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('messages');
};

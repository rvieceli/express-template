import database from '../../src/database';

// TODO: ver proque da erro de IO

export default function truncate() {
  return Promise.all(
    Object.keys(database.connection.models).map(model => {
      return database.connection.models[model].destroy({
        truncate: true,
        force: true,
      });
    })
  );
}

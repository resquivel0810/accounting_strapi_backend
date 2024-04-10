const parse = require('pg-connection-string').parse;
// const config = parse(process.env.DATABASE_URL);
module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: parse(process.env.DATABASE_HOST),
      port: parse(process.env.DATABASE_PORT),
      database: parse(process.env.DATABASE_NAME),
      user: parse(process.env.DATABASE_USERNAME),
      password: parse(process.env.DATABASE_PASSWORD),
      ssl: {
        rejectUnauthorized: false
      },
    },
    debug: false,
  },
});
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;

const pg = require("pg");
const { Pool } = require("pg");
const pool = new Pool();
var url = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

const createPlaceholder = (rowCount, columnCount, startAt = 1) => {
  var index = startAt;
  return Array(rowCount)
    .fill(0)
    .map(
      () =>
        `(${Array(columnCount)
          .fill(0)
          .map(() => `$${index++}`)
          .join(", ")})`
    )
    .join(", ");
};

const execute = query => {
  return new Promise((resolve, reject) => {
    const client = new pg.Client(url);
    client.connect(function(err) {
      if (err) {
        reject(err);
      }
    });
    client.query(query, function(err, result) {
      if (err) {
        reject(err);
      }
      client.end();
      resolve(result);
    });
  });
};

const executeWithParam = (query, parameter) => {
  return new Promise((resolve, reject) => {
    const client = new pg.Client(url);
    client.connect(function(err) {
      if (err) {
        reject(err);
      }
    });

    client.query(query, parameter, function(err, result) {
      if (err) {
        reject(err);
      }
      client.end();
      resolve(result);
    });
  });
};

module.exports = {
  execute: execute,
  executeWithParam: executeWithParam,
  createPlaceholder: createPlaceholder
};

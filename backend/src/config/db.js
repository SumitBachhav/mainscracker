const { Sequelize } = require("sequelize");

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
} = require("../constant");

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT || 3306,
  dialect: process.env.DB_DIALECT || "mysql",
  logging: console.log,
});

module.exports = { sequelize };

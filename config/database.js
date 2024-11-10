const { Sequelize } = require("sequelize");

const database = process.env.DATABASE;
const username = process.env.USER;
const password = process.env.PASSWORD;
const dialect = process.env.DIALECT;
const host = process.env.HOST;

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = {
  connectDatabase: async () => {
    try {
      sequelize.sync({});
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  },
  db: sequelize,
};

require("dotenv").config;
const sequelize = require("./config/db");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
})();

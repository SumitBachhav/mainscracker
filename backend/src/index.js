const { sequelize } = require("./models");

(async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ alter: true });
    // console.log("All models were synchronized.");
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
})();

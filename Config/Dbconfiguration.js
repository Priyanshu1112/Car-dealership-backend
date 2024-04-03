const mongoose = require("mongoose");
const url =
  process.env.NODE_ENV === "development"
    ? process.env.DB_URL_DEV
    : process.env.DB_URL_PROD;

const dbconnection = async () => {
  try {
    await mongoose.connect(url);
    console.log("db is connected!");
  } catch (error) {
    console.log("soemthing went wrong while connecting to db", error);
  }
};

module.exports = dbconnection;

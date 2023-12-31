require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const app = require("./app");

mongoose.connect(process.env.DATABASE, {}).then(() => {
  console.log("Database connected");
});

let listener = app.listen(process.env.PORT || 4000, () => {
  console.log(`App is running on ` + listener.address().port);
});

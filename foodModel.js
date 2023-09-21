const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },

  carbohydrate: {
    type: Number,
    required: true,
  },
  sugar: {
    type: Number,
    // required: true,
  },
  energy: {
    type: Number,
    required: true,
  },
});
const Food = mongoose.model("foods", foodSchema);
module.exports = Food;

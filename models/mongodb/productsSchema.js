const mongoose = require("mongoose");
const { Schema } = mongoose;

const productsSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
});

module.exports = productsSchema;
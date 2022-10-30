const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.connect('mongodb+srv://Skaelet:backCoder@desafio9.xmupe0a.mongodb.net/ecommerce?retryWrites=true&w=majority');

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = userSchema;
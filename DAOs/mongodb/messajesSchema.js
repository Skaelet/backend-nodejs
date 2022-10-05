const mongoose = require("mongoose");
const { Schema } = mongoose;

const messajesSchema = new Schema({
    author: { },
    text: { type: String, required: true },
});

exports.module = mongoose.model("messajes", messajesSchema);
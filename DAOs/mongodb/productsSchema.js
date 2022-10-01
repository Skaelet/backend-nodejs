const mongoose = require('mongoose');
const { Schema } = mongoose;

const productsSchema = new Schema({
    timestamp: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    code: { type: String, require: true },
    thumbnail: { type: String, require: true },
    price: { type: Number, require: true },
    stock: { type: Number, require: true },
});

module.exports = mongoose.model('productos', productsSchema);
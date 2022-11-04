require('dotenv').config();
const mongoose = require("mongoose");
const schema = require("./mongodb/messagesSchema");
const conn = mongoose.createConnection(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@desafio9.xmupe0a.mongodb.net/ecommerce?retryWrites=true&w=majority`);
const model = conn.model('Messages', schema);

class Messages {
  async save (Object) {
    try {
      return await model.create(Object);
    } catch (error) {
      console.error(error);
    }
  }

  async getById(id) {
    try{
      return await model.findById(id);
    } catch(error) {
      console.log("Producto no encontrado. Error: \n", error);
    }
  }

  async getAll() {
    try{
      return await model.find({});
    } catch(error) {
      console.log("No hay productos. Error: \n", error);
    }
  }

  async deleteById(id) {
    try{
      return await model.deleteOne({ id: id });
    } catch(error) {
      console.log("El archivo no existe o no posee un array vacío. Error: \n", error);
    }
  }

  async updateProduct(id, Object) {
    try {
      return await model.updateOne({ id: id }, Object);
    } catch (error) {
        console.log("El archivo no existe o no posee un array vacío. Error: \n", error)
    }
  }
}

module.exports = Messages;
const mongoose = require("mongoose");
const schema = require("./mongodb/productsSchema");

class Products {

    async connect () {
        await mongoose.connect('mongodb+srv://Skaelet:backCoder@desafio9.xmupe0a.mongodb.net/ecommerce?retryWrites=true&w=majority');
    }

    async disconnect () {
        await mongoose.disconnect();
    }

    async save (Object) {
        try {
            await this.connect();
            return await schema.create(Object);
        } catch (error) {
            console.error(error);
        } finally {
            await this.disconnect();
        }
    }

    async getById(id) {
        try{
            await this.connect();
            return await schema.findById(id);
        } catch(error) {
            console.log("Producto no encontrado. Error: \n", error);
        } finally {
            await this.disconnect();
        }
    }

    async getAll() {
        try{
            await this.connect();
            return await schema.exists({})? schema.find({}) : [];
        } catch(error) {
            console.log("No hay productos. Error: \n", error);
        } finally {
            await this.disconnect();
        }
    }

    async deleteById(id) {
        try{
            await this.connect();
            return await schema.deleteOne({ id: id });
        } catch(error) {
            console.log("El archivo no existe o no posee un array vacío. Error: \n", error);
        } finally {
            await this.disconnect();
        }
    }

    async updateProduct(id, Object) {
        try {
            await this.connect();
            return await schema.updateOne({ id: id }, Object);
        } catch (error) {
            console.log("El archivo no existe o no posee un array vacío. Error: \n", error)
        } finally {
            await this.disconnect();
        }
    }
}

module.exports = Products;
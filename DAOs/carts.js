const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const config = require("./firebase/ecommerce-40d76-firebase-adminsdk-f6rjo-c3a19087bf.json");

class Carts {

    constructor() {
        initializeApp({
            credential: cert(config)
        });
    }

    async save (Object) {
        try {
            console.log(Object);
            const db = getFirestore();
            const docRef = db.collection('carritos').doc()
            return await docRef.set(Object);
        } catch (error) {
            console.error(error);
        }
    }

   async getById(id) {
        try{
            const db = getFirestore();
            const doc = await db.collection('carritos').doc(id).get()
            return doc.data();
        } catch(error) {
            console.log("Carrito no encontrado. Error: \n", error);
        }
    }

    async deleteById(id) {
        try{
            const db = getFirestore();
            return await db.collection('carritos').doc(id).delete();
        } catch(error) {
            console.log("El archivo no existe o no posee un array vacío. Error: \n", error);
        }
    }

    async updateProduct(id, Object) {
        try {
            const db = getFirestore();
            const docRef = db.collection('carritos').doc(id);
            return await docRef.set(Object);
        } catch (error) {
            console.log("El archivo no existe o no posee un array vacío. Error: \n", error)
        }
    }
}

module.exports = Carts;
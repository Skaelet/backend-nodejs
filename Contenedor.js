const fs = require("fs");

class Contenedor{
    constructor(rutaArchivo=''){
        this.rutaArchivo = rutaArchivo;
    }

    async save (Object) {
        try {
            let contenido = await fs.promises.readFile(this.rutaArchivo, 'utf-8');
            let arreglo;
            let newId = 1;
            try {
                arreglo = await JSON.parse(contenido);
            } catch (error) {
                arreglo = [];
            }
            if(arreglo.length > 0) {
                let ids = arreglo.map((obj) => obj.id).sort((a, b) => a - b);
                newId = ids.pop() + 1;
                arreglo.push({id: newId, ...Object});
                await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(arreglo, null, 3));
                return newId;
            } else {
                arreglo.push({id: newId, ...Object});
                await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(arreglo, null, 2));
                return newId;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async getById(id) {
        try{
            let contenido = await fs.promises.readFile(this.rutaArchivo, 'utf-8');
            let arreglo = JSON.parse(contenido);
            let objeto = arreglo.find(obj => obj.id == id);
            return (objeto === undefined)? {error: "producto no encontrado"} : objeto;
        } catch(error) {
            console.log("El archivo no existe o no posee un array vacío. Error: \n", error);
        }
    }

    async getAll() {
        try{
            let contenido = await fs.promises.readFile(this.rutaArchivo, 'utf-8');
            let arreglo = JSON.parse(contenido);
            return arreglo;
        } catch(error) {
            console.log("El archivo no existe o no posee un array vacío. Error: \n", error);
        }
    }

    async deleteById(id) {
        try{
            let contenido = await fs.promises.readFile(this.rutaArchivo, 'utf-8');
            let arreglo = JSON.parse(contenido);
            let deletedProd = {error: "id no encontrado"}
            for (let index = 0; index < arreglo.length; index++) {
                if(id == arreglo[index].id){
                    deletedProd = arreglo[index];
                    arreglo.splice(index, 1);
                    await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(arreglo, null, 2));
                    return deletedProd;
                }
            }
            return deletedProd;
        } catch(error) {
            console.log("El archivo no existe o no posee un array vacío. Error: \n", error);
        }
    }

    async deleteAll() {
        try{
            await fs.promises.writeFile(this.rutaArchivo, JSON.stringify([], null, 2));
        } catch(error) {
            console.log("El archivo no existe o no posee un array vacío. Error: \n", error);
        }
    }

    async getProductRandom() {
        try{
            let contenido = await fs.promises.readFile(this.rutaArchivo, 'utf-8');
            let arreglo = JSON.parse(contenido);
            const indexRandom = Math.floor(Math.random()*arreglo.length);
            return arreglo[indexRandom];
        } catch(error) {
            console.log("El archivo no existe o no posee un array vacío. Error: \n", error);
        }
    }

    async updateProduct(Object){
        try {
            let contenido = await fs.promises.readFile(this.rutaArchivo, 'utf-8');
            let arreglo = JSON.parse(contenido);
            for (let index = 0; index < arreglo.length; index++) {
                if(Object.id == arreglo[index].id){
                    arreglo[index] = Object;
                    await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(arreglo, null, 2));
                    return Object;
                }
            }
            return {error: "producto no encontrado"};
        } catch (error) {
            console.log("El archivo no existe o no posee un array vacío. Error: \n", error)
        }
    }
}

module.exports = Contenedor;
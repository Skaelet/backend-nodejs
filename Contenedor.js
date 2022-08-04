const fs = require("fs");

class Contenedor{
    constructor(rutaArchivo=''){
        this.rutaArchivo = rutaArchivo;
    }

    async save (Object) {
        try {
            let contenido = await fs.promises.readFile(this.rutaArchivo, 'utf-8');
            console.log(contenido);
            let arreglo;
            let newId = 1;
            try {
                arreglo = await JSON.parse(contenido);
            } catch (error) {
                arreglo = [];
            }
            console.log(arreglo);
            if(arreglo.length > 0) {
                let ids = arreglo.map((obj) => obj.id).sort((a, b) => a - b);
                newId = ids.pop() + 1;
                arreglo.push({id: newId, ...Object});
                await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(arreglo, null, 3));
                return newId;
            } else {
                console.log("ELSE");
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
            let objeto = arreglo.find(obj => obj.id === id);
            return (objeto === undefined)? null : objeto;
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
            arreglo = arreglo.filter(obj => obj.id !== id);
            await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(arreglo, null, 2));
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
}

module.exports = Contenedor;

const escuadra = {                                                                                                                                                    
    title: 'Escuadra',                                                                                                                                 
    price: 123.45,                                                                                                                                     
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png',
}

const calculadora = {                                                                                                                                                    
    title: 'Calculadora',                                                                                                                              
    price: 234.56,                                                                                                                                     
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png',
}

const globo = {                                                                                                                                                    
    title: 'Globo Terráqueo',                                                                                                                          
    price: 345.67,                                                                                                                                     
    thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png',
}  


/* async function main () {
    const contenedor = new Contenedor ("productos.json");
    
    console.log("Método getById(): ",await contenedor.getById(10));
    
    await contenedor.save(escuadra);
    await contenedor.save(calculadora);
    await contenedor.save(globo);

    console.log("Método getById(): ",await contenedor.getById(2));
    console.log("Método getById(): ",await contenedor.getById(10));

    await contenedor.deleteById(2);

    console.log("Método getAll(): ", await contenedor.getAll());

    //await contenedor.deleteAll();
}

main(); */
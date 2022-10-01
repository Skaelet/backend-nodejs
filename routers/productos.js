const { getTimestamp } = require('../lib/common');

const express = require('express');
const { Router } = express;
const routerProducts = Router();
const app = express();
const { Productos } = require('../DAOs/main.js');
const productsList = new Productos();
const admin = true;

const authentication = (req, res, next) => {
    admin? next() : res.json({ 
        error: -1, 
        descripcion: `en ruta ${req.originalUrl} método ${req.method} no autorizado.` 
    });
}

app.use('*', (req, res) => {
    res.json({ 
        error: -2, 
        descripcion: `en ruta ${req.originalUrl} método ${req.method} no implementado.` 
    })
});

routerProducts.get('/:id?', async(req, res) => {
    const { id } = req.params;
    const response = id? await productsList.getById(id) : await productsList.getAll();
    res.json(response);
});

routerProducts.post('/', authentication, async(req, res) => {
    const { 
        name, 
        description, 
        code, 
        thumbnail, 
        price, 
        stock,
    } = req.body;

    const newProd = {
        timestamp: getTimestamp(),
        name: name, 
        description: description, 
        code: code, 
        thumbnail: thumbnail, 
        price: parseInt(price), 
        stock: parseInt(stock),
    };

    console.log(newProd.timestamp);

    res.json(await productsList.save(newProd));
});

routerProducts.put('/:id', authentication, async(req, res) => {
    const { id } = req.params;
    const { 
        name, 
        description, 
        code, 
        thumbnail, 
        price, 
        stock,
    } = req.body;

    const updateProd = {
        id: parseInt(id),
        timestamp: getTimestamp(),
        name: name,
        description: description,
        code: code,
        thumbnail: thumbnail,
        price: parseInt(price),
        stock: parseInt(stock),
    }

    res.json(await productsList.updateProduct(id, updateProd));
});

routerProducts.delete('/:id', authentication, async(req, res) => {
    const { id } = req.params;
    res.json(await productsList.deleteById(id));
});

module.exports = routerProducts;
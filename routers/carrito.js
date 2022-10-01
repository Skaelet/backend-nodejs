const { getTimestamp } = require('../lib/common.js');

const express = require('express');
const { Router } = express;
const routerCart = Router();
const app = express();
const { Carritos } = require('../DAOs/main.js');
const cartList = new Carritos();

routerCart.post('/', async(req, res) => {
    const newCart = {
        timestamp: getTimestamp(),
        productos: [],
    };
    res.json(await cartList.save(newCart));
});

routerCart.delete('/:id', async(req, res) => {
    const { id } = req.params;
    res.json(await cartList.deleteById(id));
});

routerCart.get('/:id/productos', async(req, res) => {
    const { id } = req.params;
    const cart = await cartList.getById(id);
    res.json(cart);
});

routerCart.post('/:id/productos', async(req, res) => {
    const idCart = req.params.id;
    const body = req.body;
    body.id = parseInt(body.id);
    body.price = parseInt(body.price);
    body.stock = parseInt(body.stock);
    const cart = await cartList.getById(idCart);
    cart.productos.push(body);
    res.json(await cartList.updateProduct(idCart, cart));
});

routerCart.delete('/:id/productos/:id_prod', async(req, res) => {
    const { id, id_prod } = req.params;
    const cart = await cartList.getById(id);
    if (cart.productos) {
        const products = cart.productos.filter((prod) => prod.id != id_prod);
        cart.productos = products;
        res.json(await cartList.updateProduct(id, cart));
    } else {
        res.json(cart);
    }
})

module.exports = routerCart;
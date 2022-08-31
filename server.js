const express = require('express');
const { Router } = express;
const routerProducts = Router();
const routerCart = Router();
const app = express();
const PORT = process.env.PORT || 8080;
const Contenedor = require('./Contenedor.js');
const productsList = new Contenedor('./productsList.json');
const cartList = new Contenedor('./cartList.json');
const admin = true;

app.listen(PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/productos', routerProducts);
app.use('/api/carrito', routerCart);
app.use('/public', express.static(__dirname + '/public'));

const getTimestamp = () => {
    const date = new Date();
    const day = (date.getDate() < 10)? `0${date.getDate()}` : date.getDate();
    const month = ((date.getMonth()+1)<10)? `0${date.getMonth()+1}` : date.getMonth();
    const year = date.getFullYear();
    const hour = (date.getHours() < 10)? `0${date.getHours()}` : date.getHours();
    const minutes = (date.getMinutes() < 10)? `0${date.getMinutes()}` : date.getMinutes();
    const seconds = (date.getSeconds() < 10)? `0${date.getSeconds()}` : date.getSeconds();
    return `${day}/${month}/${year} - ${hour}:${minutes}:${seconds}`;
}

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

    const id = await productsList.save(newProd);

    res.json({id, ...newProd});
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

    res.json(await productsList.updateProduct(updateProd));
});

routerProducts.delete('/:id', authentication, async(req, res) => {
    const { id } = req.params;
    res.json(await productsList.deleteById(id));
});

routerCart.post('/', async(req, res) => {
    const cart = {
        timestamp: getTimestamp(),
        productos: [],
    }
    res.json(await cartList.save(cart));
});

routerCart.delete('/:id', async(req, res) => {
    const { id } = req.params;
    res.json(await cartList.deleteById(id));
});

routerCart.get('/:id/productos', async(req, res) => {
    const { id } = req.params;
    const cart = await cartList.getById(id);
    cart.productos? res.json(cart.productos) : res.json(cart);
});

routerCart.post('/:id/productos', async(req, res) => {
    const idCart = req.params.id;
    const body = req.body;
    body.id = parseInt(body.id);
    body.price = parseInt(body.price);
    body.stock = parseInt(body.stock);
    let cart = await cartList.getById(idCart);
    await cart.productos.push(body);
    res.json(await cartList.updateProduct(cart));
});

routerCart.delete('/:id/productos/:id_prod', async(req, res) => {
    const { id, id_prod } = req.params;
    const cart = await cartList.getById(id);
    if (cart.productos) {
        const products = cart.productos.filter((prod) => prod.id != id_prod);
        cart.productos = products;
        res.json(await cartList.updateProduct(cart));
    } else {
        res.json(cart);
    }
})
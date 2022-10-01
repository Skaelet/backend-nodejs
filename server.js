const express = require('express');
const routerProducts = require('./routers/productos.js');
const routerCart = require('./routers/carrito.js');
const app = express();
const PORT = 8080;

app.listen(PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/productos', routerProducts);
app.use('/api/carrito', routerCart);
app.use('*', (req, res) => {
    res.json({ 
        error: -2, 
        descripcion: `en ruta ${req.originalUrl} método ${req.method} no implementado.` 
    })
});
app.use('/public', express.static(__dirname + '/public'));
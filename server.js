const express = require('express');
const Contenedor = require('./Contenedor');
const listProducts = new Contenedor(mysql, 'products');
const listMessajes = new Contenedor(sqlite3, 'messajes');
const app = express();
const PORT = 8080;
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

httpServer.listen(PORT, () => console.log("SERVER ON"));

app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

io.on('connection', (socket) => {
  socket.emit('mensaje', 'servidor conectado');

  socket.on('product', async(product) => {
    const id = await listProducts.save(product);
    const newProduct = {
      id: id,
      ...product
    };
    io.sockets.emit('product', newProduct);
  })

  socket.on('messaje', async(messaje) => {
    await listMessajes.save(messaje);
    io.sockets.emit('messaje', messaje);
  })
});


app.get('/', async(req, res) => {
  const productsList = await listProducts.getAll();
  const messajesList = await listMessajes.getAll();
  let productsExist = productsList.length != 0;
  let messajesExist = messajesList.length != 0;
  res.render('pages/home', 
  {
    products:  productsList, 
    productsExist: productsExist,
    messajesList: messajesList,
    messajesExist: messajesExist
  });
});
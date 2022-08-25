const express = require('express');
const Contenedor = require('./Contenedor');
const contenedor = new Contenedor('./productos.json');
const listMensajes = new Contenedor('./listMensajes.json');
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
    const id = await contenedor.save(product);
    const newProduct = {
      id: id,
      ...product
    };
    io.sockets.emit('product', newProduct);
  })

  socket.on('messaje', async(messaje) => {
    await listMensajes.save(messaje);
    io.sockets.emit('messaje', messaje);
  })
});


app.get('/', async(req, res) => {
  const productsList = await contenedor.getAll();
  const messajesList = await listMensajes.getAll();
  const productsExist = productsList.length != 0;
  const messajesExist = messajesList.length != 0;
  res.render('pages/home', 
  {
    products:  productsList, 
    productsExist: productsExist,
    messajesList: messajesList,
    messajesExist: messajesExist
  });
});
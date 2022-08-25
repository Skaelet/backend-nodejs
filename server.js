const express = require('express');
const Contenedor = require('./Contenedor');
const contenedor = new Contenedor('./productos.json');
const app = express();
const PORT = 8080;
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

httpServer.listen(PORT, () => console.log("SERVER ON"));

/* const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
}); */

/* server.on('error', (error) => console.log(`Error en servidor ${error}`)); */

app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

io.on('connection', async(socket) => {
  socket.emit('mensaje', 'servidor conectado')
  socket.on('product', (product) => {
    const id = contenedor.save(product);
    const newProduct = {
      id: id,
      ...product
    };
    io.sockets.emit('product', newProduct);
  })
})


app.get('/', async(req, res) => {
  const productsList = await contenedor.getAll();
  const productsExist = productsList.length != 0;
  res.render('pages/home', 
  { 
    title: 'Listado de productos', 
    products:  productsList, 
    productsExist: productsExist
  });
})


/* app.get('/productos', async(req, res) => {
  const productsList = await contenedor.getAll();
  const productsExist = productsList.length != 0;
  res.render('pages/products', 
  { 
    title: 'Listado de productos', 
    products:  productsList, 
    productsExist: productsExist
  });
});

app.get('/', async(req, res) => {
  res.render('pages/form', {title: 'Carga de productos'});
});

app.get('/home', async(req, res) => {
  const productsList = await contenedor.getAll();
  const productsExist = productsList.length != 0;
  res.render('pages/home', 
  { 
    title: 'Listado de productos', 
    products:  productsList, 
    productsExist: productsExist
  });
})

app.post('/productos', async(req, res) => {
  const { title, price, thumbnail } = req.body;
  const newProd = {
    title: title,
    price: price,
    thumbnail: thumbnail
  }

  await contenedor.save(newProd);

  res.render('pages/form', {title: 'Carga de productos'});
}) */
const express = require('express');
const Contenedor = require('./Contenedor');
const contenedor = new Contenedor('./productos.json');
const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on('error', (error) => console.log(`Error en servidor ${error}`));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

app.get('/productos', async(req, res) => {
  const productsList = await contenedor.getAll();
  const productsExist = productsList.length != 0;
  res.render('pages/products', { title: 'Listado de productos', products:  productsList, productsExist: productsExist});
});

app.get('/', async(req, res) => {
  res.render('pages/form', {title: 'Carga de productos'});
});

app.post('/', async(req, res) => {
  const { title, price, thumbnail } = req.body;
  const newProd = {
    title: title,
    price: price,
    thumbnail: thumbnail
  }

  await contenedor.save(newProd);

  res.render('pages/form', {title: 'Carga de productos'});
})
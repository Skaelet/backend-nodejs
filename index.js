const express = require('express');
const app = express();
const PORT = 3000;
const Contenedor = require('./Contenedor.js');
const contenedor = new Contenedor('./productos.json');

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on('error', (error) => console.log(`Error en servidor ${error}`));
app.use('/public', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/products', async(req, res) => {
  const productsList = await contenedor.getAll();
  res.render('productsList.pug', { products: productsList });
});

app.get('/', async(req, res) => {
  res.render('form.pug');
})

app.post('/products', async(req, res) => {
  const { title, price, thumbnail } = req.body;
  const newProd = {
    title: title,
    price: parseInt(price),
    thumbnail: thumbnail,
  }
  await contenedor.save(newProd);
  res.render('form.pug');
});
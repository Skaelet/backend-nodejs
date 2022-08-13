const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on('error', (error) => console.log(`Error en servidor ${error}`));
app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

app.get('/', (req, res) => {
  //sirve productslist.hbs en index.hbs (index.hbs es la plantilla por defecto donde arranca todo)
  res.render('productslist', { products: productsHC, productsExist: true });
});

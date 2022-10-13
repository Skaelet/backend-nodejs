const { faker } = require('@faker-js/faker');
const { normalize, schema } = require('normalizr');
const express = require('express');
const Products = require('./DAOs/products');
const Messages = require('./DAOs/messages');
const listProducts = new Products();
const listMessages = new Messages();
const app = express();
const PORT = 8080;
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

httpServer.listen(PORT, () => console.log("SERVER ON"));

app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

const normalizeData = (msg) => {
  const user = new schema.Entity("users");
  const messages = new schema.Entity("mensajes", {
    author: user,
  });
  const chats = new schema.Entity("chats", { chats: [messages] });
  return normalize(msg, chats);
}

app.get('/', async(req, res) => {
  const productsList = await listProducts.getAll();
  const messagesList = await listMessages.getAll();

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
  
    socket.on('message', async(message) => {
      await listMessages.save(message);
      const allMessages = await listMessages.getAll();
      const messages = allMessages.map(m => {
        return {
          id: m._id,
          date: m.date,
          author: m.author,
          text: m.text,
        }
      })
      const msg = { id: "mensajes", chats: [...messages] }
      const normalizeMessages = normalizeData(msg);
      console.log(normalizeMessages);
      io.sockets.emit('message', normalizeMessages);
    })
  
    const messages = messagesList.map(m => {
      return {
        id: m._id,
        date: m.date,
        author: m.author,
        text: m.text,
      }
    })

    const msg = { id: "mensajes", chats: [...messages] }
    const normalizeMessages = normalizeData(msg);
  
    io.sockets.emit('message', normalizeMessages);
  });

  res.render('pages/home', 
  {
    products:  productsList,
  });
});

app.get('/api/productos-test', async(req, res) => {
  const id = faker.datatype.number(1000);
  const name = faker.commerce.product();
  const price = faker.commerce.price(100, 5000);
  const url = faker.image.imageUrl(720, 720, `${name}`, true);
  res.render('pages/test', 
  {
    id,
    name,
    price,
    url,
  });
})
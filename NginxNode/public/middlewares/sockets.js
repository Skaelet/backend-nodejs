const { Server } = require("socket.io");
const { normalizeData } = require('../lib/utils');
const Messages = require('../models/messages');
const listMessages = new Messages();

const startSocketConnection = (httpServer) => {
  const io = new Server(httpServer);
  io.on('connection', async(socket) => {
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
      io.sockets.emit('message', normalizeMessages);
    })

    const messagesList = await listMessages.getAll();
  
    const messages = messagesList?.map(m => {
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
} 

module.exports = { startSocketConnection };
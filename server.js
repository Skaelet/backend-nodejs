// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const PORT = 8080;
const Contenedor = require('./Contenedor.js');
const contenedor = new Contenedor ("./productos.json");

const server = app.listen(8080);

app.get("/productos", async (req, res) => {
  const productos = await contenedor.getAll();
  res.json(productos);
})

app.get("/productoRandom", async (req, res) => {
  const productoRandom = await contenedor.getProductRandom();
  res.json(productoRandom);
})
  
const express = require("express");
const { Router } = express;
const router = Router();
const app = express();
const PORT = 8080;
const Contenedor = require('./Contenedor.js');
const contenedor = new Contenedor ("./productos.json");

app.listen(PORT);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", router);
app.use("/form", express.static(__dirname + "/public"));

router.get("/", async(req, res) => {
  res.json(await contenedor.getAll());
});

router.get("/:id", async(req, res) => {
  const { id } = req.params;
  res.json(await contenedor.getById(parseInt(id)));
});

router.post("/", async(req, res) => {
  const { title, price, thumbnail } = req.body;
  const newProd = {
    title: title,
    price: parseInt(price),
    thumbnail: thumbnail,
  }
  const id = await contenedor.save({ newProd });
  res.json({id, ...newProd});
});

router.put("/:id", async(req, res) => {
  const { title, price, thumbnail } = req.body;
  const { id } = req.params;
  const newProd = {
    id: parseInt(id),
    title: title,
    price: parseInt(price),
    thumbnail: thumbnail,
  }
  res.json(await contenedor.updateProduct(newProd));
});

router.delete("/:id", async(req, res) => {
  const { id } = req.params;
  res.json(await contenedor.deleteById(parseInt(id)));
})
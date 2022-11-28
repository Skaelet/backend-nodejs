const { faker } = require('@faker-js/faker');
const Products = require('../models/products');
const listProducts = new Products();
const { fork } = require('child_process');
const os = require('os');

const getHome = async(req, res) => {
  res.render('pages/home', 
  {
    username: req.session.username,
    products:  await listProducts.getAll(),
  });
}

const getProductsTest = async(req, res) => {
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
}

const getLogin = async(req, res) => {
  res.render('pages/login');
}

const postLogin = async(req, res) => {
  const { username, password } = req.body;
  req.session.username = username;
  req.session.password = password;
  res.redirect('/');
}

const getLogout = async(req, res) => {
  const { username } = req.session;
  req.session.destroy((err) => {
    console.log(err);
  });
  res.render('pages/logout', {
    username,
  });
}

const getRegister = async(req, res) => {
  res.render('pages/register');
}

const postRegister = async(req, res) => {
  const { username, password } = req.body;
  req.session.username = username;
  req.session.password = password;
  res.redirect('/');
}

const getFailLogin = async(req, res) => {
  res.render('pages/faillogin');
}

const getFailSignup = async(req, res) => {
  res.render('pages/failsignup');
}

const getInfo = (req, res) => {
  const arg = process.argv.length > 2 ? process.argv.slice(2) : 'No se ingresaron argumentos'
  res.render('pages/info', {
    arg: `Argumentos: ${arg}`,
    so: `Sistema Operativo: ${process.platform}`,
    node: `Version Node: ${process.version}`,
    memory: `Memoria: ${process.memoryUsage.rss()}`,
    path: `Path de ejecución: ${process.execPath}`,
    pid: `Process id: ${process.pid}`,
    filename: `Directorio: ${process.cwd()}`,
    threads: `Número de hilos: ${os.cpus().length}`
  })
}

const getNumsRandoms = (req, res) => {
  const cant = req.query.cant || 100000000;
  console.log(req.query);
  const forked = fork('./lib/forks.js');
  forked.send(cant);
  forked.on('message', (result) => {
    res.json(result);
  });
}

module.exports = { 
  getHome, 
  getProductsTest, 
  getLogin, 
  postLogin, 
  getLogout, 
  getRegister, 
  postRegister, 
  getFailLogin, 
  getFailSignup,
  getInfo,
  getNumsRandoms
}
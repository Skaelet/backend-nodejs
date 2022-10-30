const { faker } = require('@faker-js/faker');
const Products = require('../models/products');
const listProducts = new Products();

const getHome = async(req, res) => {
  if(req?.session?.username){
    res.render('pages/home', 
    {
      username: req.session.username,
      products:  await listProducts.getAll(),
    });
  } else {
    res.redirect('/register');
  }
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

module.exports = { 
  getHome, 
  getProductsTest, 
  getLogin, 
  postLogin, 
  getLogout, 
  getRegister, 
  postRegister, 
  getFailLogin, 
  getFailSignup 
}
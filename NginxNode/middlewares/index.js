const express = require('express');
const passport = require('passport')
const { loginPassport, signupPassport } = require('../auth/passport')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MINUTE } = require('../lib/const');
const advancedOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const startMiddlewares = app => {
  app.use(express.static('/public'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(session({
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://Skaelet:backCoder@desafio9.xmupe0a.mongodb.net/ecommerce?retryWrites=true&w=majority',
      mongoOptions: advancedOptions,
    }),
    secret: 'Gauss',
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 10*MINUTE, //minutos de persistencia
    }
  }))

  loginPassport(passport);
  signupPassport(passport);
  app.use(passport.initialize());
  app.use(passport.session());

  app.set('view engine', 'ejs');
}

module.exports = { startMiddlewares };
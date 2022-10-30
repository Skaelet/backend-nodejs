const { faker } = require('@faker-js/faker');
const { normalize, schema } = require('normalizr');
const express = require('express');
const Products = require('./DAOs/products');
const Messages = require('./DAOs/messages');
const User = require('./DAOs/mongodb/userSchema');
const listProducts = new Products();
const listMessages = new Messages();
const app = express();
const PORT = 8080;
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const advancedOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const bCrypt = require('bcrypt');

httpServer.listen(PORT, () => console.log("SERVER ON"));

app.use('/public', express.static(__dirname + '/public'));
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
    maxAge: 1*60*1000, //minutos de persistencia
  }
}))

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

passport.use('login', new LocalStrategy(
  async(username, password, done) => {
    mongoose.createConnection('mongodb+srv://Skaelet:backCoder@desafio9.xmupe0a.mongodb.net/ecommerce?retryWrites=true&w=majority');
    User.findOne({ username }, function (err, user) {
      if (err)
        return done(err);
 
      if (!user) {
        console.log('User Not Found with username ' + username);
        return done(null, false);
      }
 
      if (!isValidPassword(user, password)) {
        console.log('Invalid Password');
        return done(null, false);
      }
 
      return done(null, user);
    });
  })
 );
 
passport.use('signup', new LocalStrategy({
  passReqToCallback: true
 },
  async(req, username, password, done) => {
    mongoose.createConnection('mongodb+srv://Skaelet:backCoder@desafio9.xmupe0a.mongodb.net/ecommerce?retryWrites=true&w=majority');
    User.findOne({ username }, function (err, user) {
 
      if (err) {
        console.log('Error in SignUp: ' + err);
        return done(err);
      }
 
      if (user) {
        console.log('User already exists');
        return done(null, false)
      }
 
      const newUser = {
        username: username,
        password: createHash(password),
      }
      User.create(newUser, (err, userWithId) => {
        if (err) {
          console.log('Error in Saving user: ' + err);
          return done(err);
        }
        console.log(user)
        console.log('User Registration succesful');
        return done(null, userWithId);
      });
    });
  })
 )  

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, done);
});


app.get('/', async(req, res) => {
  if(req?.session?.username){
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
        io.sockets.emit('message', normalizeMessages);
      })
    
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

    res.render('pages/home', 
    {
      username: req.session.username,
      products:  productsList,
    });
  } else {
    res.redirect('/register');
  }
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

app.get('/login', async(req, res) => {
  res.render('pages/login');
});

app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async(req, res) => {
  const { username, password } = req.body;
  req.session.username = username;
  req.session.password = password;
  res.redirect('/');
});

app.get('/logout', async(req, res) => {
  const { username } = req.session;
  req.session.destroy((err) => {
    console.log(err);
  });
  res.render('pages/logout', {
    username,
  });
})

app.get('/register', async(req, res) => {
  res.render('pages/register');
});

app.post('/register', passport.authenticate('signup', { failureRedirect: '/failregister' }), async(req, res) => {
  const { username, password } = req.body;
  req.session.username = username;
  req.session.password = password;
  res.redirect('/');
});

app.get('/faillogin', async(req, res) => {
  res.json({message: 'Fallo en el login'})
})

app.get('/failsignup', async(req, res) => {
  res.json({message: 'Fallo en el signup'})
})

const normalizeData = (msg) => {
  const user = new schema.Entity("users");
  const messages = new schema.Entity("mensajes", {
    author: user,
  });
  const chats = new schema.Entity("chats", { chats: [messages] });
  return normalize(msg, chats);
}

const createHash = (password) => {
  return bCrypt.hashSync(
    password,
    bCrypt.genSaltSync(10),
    null);
}

const isValidPassword = (user, password) => {
  const hash = createHash(password);
  return bCrypt.compare(user.password, hash)
}
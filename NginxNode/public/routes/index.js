const protect = require('../auth/protect');
const routes = require('../controllers/index');

const getRoutes = app => {
  app.get('/', protect.checkAuth, routes.getHome);

  app.get('/api/productos-test', protect.checkAuth, routes.getProductsTest);

  app.get('/login', routes.getLogin);

  app.post('/login', protect.login, routes.postLogin);

  app.get('/logout', routes.getLogout);

  app.get('/register', routes.getRegister);

  app.post('/register', protect.signup, routes.postRegister);

  app.get('/faillogin', routes.getFailLogin);

  app.get('/failsignup', routes.getFailSignup);

  app.get('/info', protect.checkAuth, routes.getInfo);

  app.get('/api/randoms', protect.checkAuth, routes.getNumsRandoms)
}

module.exports = { getRoutes };
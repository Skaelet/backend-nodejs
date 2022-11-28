const passport = require("passport");

const login = passport.authenticate('login', { failureRedirect: '/faillogin' });
const signup = passport.authenticate('signup', { failureRedirect: '/failsignup' });
const checkAuth = async(req, res, next) => {
  req.isAuthenticated()
    ? next()
    : res.redirect('/login')
}

module.exports = {login, signup, checkAuth};
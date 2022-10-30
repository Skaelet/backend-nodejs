const passport = require("passport");

const login = passport.authenticate('login', { failureRedirect: '/faillogin' });
const signup = passport.authenticate('signup', { failureRedirect: '/failsignup' });

module.exports = {login, signup};
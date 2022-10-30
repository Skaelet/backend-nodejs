const LocalStrategy = require('passport-local').Strategy;
const { createHash, isValidPassword } = require('../lib/utils');
const User = require('../models/users');

const loginPassport = passport => {
  passport.use('login', new LocalStrategy(
    (username, password, done) => {
      User.findOne({ username }, async function (err, user) {
        if (err)
          return done(err);
    
        if (!user) {
          console.log('User Not Found with username ' + username);
          return done(null, false);
        }
    
        if (!await isValidPassword(user, password)) {
          console.log('Invalid Password');
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, done);
  });
}

const signupPassport = passport => {
  passport.use('signup', new LocalStrategy({
    passReqToCallback: true
    },
    (req, username, password, done) => {
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
}

module.exports = { loginPassport, signupPassport };
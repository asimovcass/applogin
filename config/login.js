const LocalStrategy   = require('passport-local').Strategy;
const User = require('../models/user');
const bCrypt = require('bcryptjs');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          console.log('El email no es correcto');
          return done(null, false, { message: 'Email Incorrect' } );
        }
        if (!isValidPassword(user, password)) {
          console.log('El password no es correcto');
          return done(null, false, { message: 'Password Incorrect' });
        }
          console.log('Datos correctos');
          return done(null, user);
      });
    })
  );

    const isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
}
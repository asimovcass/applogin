const User = require('../models/user');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const passport = require('passport');

exports.createUser = (req, res, next) => {

       let errors = [];

       const { name, email, password, password2 } = req.body
    
       User.findOne({ email: email }).then(user => {
           if(user){
               errors.push( { msg: 'Email already exists' });
               res.render('register', {
                   errors,
                   name,
                   email
               });
           } else {
       const newUser = new User({
        name,
        email,
        password
       });

       bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              req.flash('msg_exitoso','You are now registered and can log in');
              res.redirect('/users/login');
            })
            .catch(err => console.log(err));
        });
      });
    }
});
}

exports.login = (req,res,next) => {
     passport.authenticate('local',
     {
         successRedirect: '/dashboard',
         failureRedirect: '/users/login',
         failureFlash: true
     })(req, res, next);
}

exports.logout = (req,res,next) => {
    req.logout();
    req.flash('msg_exitoso', 'You are logged out');
    res.redirect('/users/login')
}
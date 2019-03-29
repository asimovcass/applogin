const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 9000;
const app = express();

//mensajes flash
app.use(flash());

var initPassport = require('./config/init');
initPassport(passport);

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('combined'));
app.use(bodyParser.json())
app.use(expressLayouts);
app.set('view engine', 'ejs');

//body parser
app.use(express.urlencoded({ extended: true }));

//Connect MongoDB
const db = require('./config/keys').mongoURI;

mongoose.connect(db,{ useNewUrlParser: true });
mongoose.connection.on('connected', () => {  
    console.log('Mongoose default connection open to ' + db);
}); 
mongoose.connection.on('error', (err) => {  
    console.log('Mongoose default connection error: ' + err);
}); 


//variables globales para ejs
app.use((req,res,next) => {
    res.locals.msg_exitoso = req.flash('msg_exitoso');
    res.locals.msg_warning = req.flash('msg_warning');
    res.locals.msg_error = req.flash('msg_error');
    next();
})

//routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

//start server
app.listen(PORT, () => {
    console.log(`HTTP server listen on port ${PORT}`);
}).on('error', function(err) {
    if(err){
        console.log(err);
    }
});
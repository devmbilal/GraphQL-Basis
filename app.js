require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const session = require('express-session')
const flash=require('connect-flash')
const methodOverride = require('method-override');


const app = express();
const port = process.env.PORT || 5000;

connectDB();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//Express Session
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 10000*60*60*24*7 // 1 week
    }
}));

// setup flash
app.use(
  flash({ sessionKeyName: 'express-flash-message'}));
 
 // Static Fields 
app.use(express.static('public'));

//Express Session
app.use(session({
   session:'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 10000*60*60*24*7 // 1 week
    }

})
);

// setup flash
app.use(
  flash({ sessionKeyName: 'express-flash-message'}));

// Templating Engine   
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/customer'));

//Handlle 404
app.get('*', (req, res) => {  
    res.render('404');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
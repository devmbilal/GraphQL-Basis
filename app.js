require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./server/graphql/schema');

const app = express();
const port = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 10000 * 60 * 60 * 24 * 7 // 1 week
    }
}));

// Flash Messages
app.use(flash({ sessionKeyName: 'express-flash-message' }));

// Static Files
app.use(express.static('public'));

// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// REST API Routes
app.use('/', require('./server/routes/customer'));

// GraphQL Endpoint
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true 
}));

// Handle 404
app.get('*', (req, res) => {
    res.render('404');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

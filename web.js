const express  = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('scuola.db');
const hbs = require('hbs');

hbs.registerPartials(path.join(__dirname, 'views/partials'));


//use sessions for tracking logins
const session = require('express-session');

// Create express app using session
const app = express();
app.use(session({secret: 'ssshhhhh'}));

// Body parser middleware
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('view engine', 'hbs')

// Set public folder
app.use('/static', express.static(path.join(__dirname, 'public')));

// route

// Login Page
app.get('/login', (req, res) => {
    //
    if(req.session.loggedin) {
        res.redirect('/home');
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
})

// Login Post
// read the username and password data from form html
app.post('/login', (req, res) => {
    //chek if body is undefined
    if (req.body === undefined) {
        res.send('Undefined body');
        return;
    }
    // read the username and password data from form html
    const username = req.body.username;
    const password = req.body.password;

    //check inline embedded password for root
    if (username === 'root' && password === 'root') {
        req.session.loggedin = true;
        req.session.username = username;
        req.session.name = "Mastroianni Michele";
        //redirect to home page
        res.redirect('/home');
    } else {
        //res.send('Incorrect Username and/or Password!');
        res.render('error', {
            message: 'Incorrect Username and/or Password!'
        });
    }
    
});

app.get('/logout', (req, res) => {
    req.session.loggedin = false;
    res.redirect('/login');
});

app.get('/home', (req, res) => {

    //verifica se l'utente è loggato
    if (req.session.loggedin) {
        res.render('home', {
            name: req.session.name
          });
        //res.send('Welcome back, ' + req.session.name + '!' + '<br>' + '<a href="/logout">Logout</a>');
    } else {
        //redirect to login page
        res.redirect('/login');
    }
    
});

// Start server
const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));


const express  = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//const cors = require('cors');

//const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database('scuola.db');
const mock = require('./DBMock.js');
const db = new mock();

const hbs = require('hbs');


//use sessions for tracking logins
const session = require('express-session');
const DBMock = require('./DBMock.js');

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

    //chek if username and password are correct
    
    const user = db.getUserByUsername(username);
    if (user && user.password === password) {
        req.session.loggedin = true;
        req.session.name = user.nome;
        req.session.role = user.ruolo;
        res.redirect('/home');
    }
    else {
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
        if(req.session.role === 'admin') {
            res.render('admin/home', {
                name: req.session.name,
                role: req.session.role,
                message: 'Welcome back, ' + req.session.name + '!'
            });
        }else {
            res.render('home', {
                name: req.session.name,
                role: req.session.role,
                message: 'Welcome back, ' + req.session.name + '!'
            });
        }
        //res.send('Welcome back, ' + req.session.name + '!' + '<br>' + '<a href="/logout">Logout</a>');
    } else {
        //redirect to login page
        res.redirect('/login');
    }
    
});

// Start server
const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));


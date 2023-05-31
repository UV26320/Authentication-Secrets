//jshint esVersion:6

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');



const app = express();  


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: 'I love you...:)',
    resave: false,
    saveUninitialized: true,
}))


app.use(passport.initialize());
app.use(passport.session());      // the session dealing with passport


mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });
// mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/', (req, res) => {
    res.render("home");
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/secrets', (req, res) => {
    if(req.isAuthenticated()){
              res.render("secrets");
    }else{
        res.render("/login");
    }
});


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.post('/register', (req, res) => {

    User.register({username: req.body.username}, req.body.password,function(err, user) {
        if (err) {
            console.log("Error: " + err);
            res.redirect("/register");
        }else{
             passport.authenticate("local")(req,res, function(){
                res.redirect("/secrets");
             })
        }
    });

});


app.post('/login', (req, res) => {
     
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log("Error:" + err );
            res.redirect("/login");
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/secrets");
            });
        }
    });
});



app.listen(3000, function () {
    console.log("Server started on port 3000");
});
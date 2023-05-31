//jshint esVersion:6

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// var encrypt = require('mongoose-encryption');
const md5 = require('md5');

const app = express();

// console.log(process.env.SECRET);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//TODO

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render("home");
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.get('/login', (req, res) => {
    res.render("login");
});


app.post('/register', (req, res) => {

    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save()
        .then(() => {
            res.render("secrets");
        }).catch((err) => {
            console.error(err);
        })
});


app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({ email: username })
        .then((foundUser) => {
            if (foundUser && foundUser.password === password) {
                res.render("secrets");
            } else {
                res.send("Invalid username or password.");
            }
        })
        .catch((err) => {
            console.error(err);
            res.send("An error occurred here something are missing Please try again");
        });
});


app.listen(3000, function () {
    console.log("Server started on port 3000");
});
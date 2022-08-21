//First Line ALWAYS for Environment variable
require('dotenv').config();

const express = require("express");

const bodyParser = require("body-parser");

//Require Mongoose
const mongoose = require("mongoose");

//Require Mongoose Encryption
const encrypt = require('mongoose-encryption');

//Tell app to use express
const app = express();

app.set('view engine', 'ejs'); // Tells app to use EJS engine

// Always below const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

//use public folder for css
app.use(express.static("public"));

//Create Mongoose Connection
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

//Set Home Route
app.get("/", function(req,res){
    res.render("home");
});
//Set Login Route
app.get("/login", function(req,res){
    res.render("login");
});
//Set Register Route
app.get("/register", function(req,res){
    res.render("register");
});

//Create Mongoose userSchema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//ALWAYS Before Mongoose Model add encrypt plug in

userSchema.plugin(encrypt,{
    //take secret from environment file
    secret:process.env.SECRET,
    encryptedFields :['password']
    // It encrypt on save and decrypt on find method
});

//Create User model
const User = new mongoose.model("User", userSchema);

//Show My Secret upon registeration using email and passoword
app.post("/register", function (req,res){
     
    const newUser= new User({
        //Register.ejs name property of email
        email : req.body.username, 
        //Register.ejs name property of password
        password : req.body.password
     });
     
     newUser.save(function(err){
        if(err)
        console.log(err);
        else
        res.render("secrets");
     })
});

//Show My Secret upon login
app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}, function(err, foundUser){
        if(err)
        console.log(err);
        else if (foundUser)
        {
            if(foundUser.password === password)
            res.render("secrets");
        }
    })
});







app.listen(3000, function(){
     console.log("Server Started on port 3000");
});

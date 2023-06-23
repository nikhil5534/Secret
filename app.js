require('dotenv').config(); 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt =require("mongoose-encryption")

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));
console.log(process.env.SECRET);

app.use(express.static("public"))
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema=new mongoose.Schema({
    email: String,
    password: String
}); 

userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["password"] })
const User =new mongoose.model("User",userSchema) 
const secretSchema  ={
    secret: String
};
const Secret =new mongoose.model("Secret",secretSchema)
app.get("/",function(req,res){
    res.render("home")
});

app.get("/login",function(req,res){
    res.render("login")
});

app.get("/register",function(req,res){
    res.render("register")
});
app.get("/submit",function(req,res){
    res.render("submit")
});

app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password: req.body.password
    });
   newUser.save(res.render("secrets")) 
});
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    User.findOneAndUpdate({email:username}).then(function(founduser){
            if(founduser){
                if(founduser.password=== password){
                    res.render("secrets")
                }
            }
        
    });
});
app.get("/logout",function(req,res){
    res.render("home")
});
app.post("/submit",function(req,res){
    const newSecret = new Secret({
        secret:req.body.secret
    });
    newSecret.save(res.render("secrets"))
})


app.listen( process.env.PORT||4000,function(){
    console.log("Server Started on Port 3000");
}); 
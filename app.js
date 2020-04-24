// configure dotenv
require('dotenv').config();

var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride  = require("method-override");
var Campground = require("./models/campground");
var User = require("./models/user");
var Comment   = require("./models/comment");
////var seedDB = require("./seed");

// const imp = require("imp");
// imp.connect({
//   GMAILPW: process.env.GMAILPW
// })


var commentRoutes   = require("./routes/comments"),
    reviewRoutes    = require("./routes/reviews"),
    campgroundRoutes= require("./routes/campgrounds"),
    authRoutes      = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/yelpcampv2", {useNewUrlParser:true});

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seed the database
//seedDB();
app.locals.moment = require('moment');
//===============================================
//PASSPORT CONFIGURATION
//===============================================
app.use(require("express-session")({
  secret : "I M the best",
  resave : false,
  saveUninitialized  : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error=req.flash("error");
  res.locals.success=req.flash("success");
  next();
});


app.use(authRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.listen(3000,function(){
    console.log("The Server is running at port 3000");
});
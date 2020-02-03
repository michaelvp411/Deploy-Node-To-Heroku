var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
    port                    = 3000;


mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});


var app = express();
app.set('view engine', "ejs");

//secret is used to encode and decode the 'sessions'
app.use(require("express-session")({
    secret: "Smokey is the best dog ever!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function(req, res){
  res.render("home");
});


app.get("/secret", function(req, res){
  res.render("secret");
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

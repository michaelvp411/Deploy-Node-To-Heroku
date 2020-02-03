var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
    port                    = 3000;


mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});


var app = express();
app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//secret is used to encode and decode the 'sessions'
app.use(require("express-session")({
    secret: "Smokey is the best dog ever!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//user authenticate that is coming from passprot local mongoose
//okta
passport.use(new LocalStrategy(User.authenticate()))

//codifies
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=========
// ROUTES
//==========

app.get("/", function(req, res){
  res.render("home");
});


app.get("/secret", function(req, res){
  res.render("secret");
});

//show sign up form
app.get("/register", function(req, res){
  res.render("register");
});

//handling user sign up
//make a new user object pass in username pass the passowrd as
//second argument to user.regiser. which will hash it
//and stores that in the db should return
//a new user with username and hashed password
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        // logs the user in runs the serilazeUser method using the local localStrategy
        //CHANGE THIS STRATEGY LATER THIS IS PROBABLY WHERE THE OKTA STUFF GOES.
        passport.authenticate("local")(req, res, function(){
           res.redirect("/secret");
        });
    });
});


//LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render("login");
});
//login logic
//middleware authenticate Okta? code runs before final call back
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

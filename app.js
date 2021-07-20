const express = require ('express');
const path = require('path');
const http = require('http');
const mongoose = require ('mongoose');
const passport = require ('passport');
const LocalStrategy = require ('passport-local');
const passportLocalMongoose = require ('passport-local-mongoose');
const bodyParser = require ('body-parser');
const flash = require ('connect-flash');
const nodemailer = require ('nodemailer');
const session = require('express-session');
const expressValidator = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const crypto = require ('crypto');
const async = require('async');
const {isLoggedIn} = require('./middleware');

require('dotenv').config();


const app = express();

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"));


const databaseDb = require ("./config/mongo");

const userRouter = require ("./routes/user"); 
const airtimeRouter = require ("./routes/airtime");
const datasubRouter = require ("./routes/datasub");
const cabletvRouter = require ("./routes/cabletv");
const electricityRouter = require ("./routes/electricity");

const User = require("./models/user")


const port = process.env.PORT || '3000';

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());

app.use(session({
	secret:'saveforme',
	resave:false,
	saveUninitialized: true
}));

	app.use(passport.initialize());
	app.use(passport.session());
	passport.use(new LocalStrategy(User.authenticate()));
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());


	app.use(flash());

	
	app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.messages = req.flash("fail");
	next();
});

app.use("/", userRouter);
app.use("/", airtimeRouter);
app.use("/", datasubRouter);
app.use("/", cabletvRouter);
app.use("/", electricityRouter);


app.set("port", port);

app.get('/', function(req, res){
	res.render("index");
});
app.get('/pay-bills', function(req, res){
	res.render("pay-bills");
});
app.get('/about', function(req, res){
	res.render("about");
});
app.get('/contact', function(req, res){
	res.render("contact");
});

app.get('/FAQs-Testimonials', function(req, res){
	res.render("FAQs-Testimonials");
});

app.get('/reset/:token', function(req, res) {
  User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgotPassword');
    }
    res.render('reset', {
      token: req.params.token
    });
  });
});

app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
       User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
		
        const password = req.body.password;
		const hash = bcrypt.hash(password, 12);
		user.password = {password:hash};
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: '@gmail.com',
          pass: process.env.GMAIL_PW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'info@lightuplink.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});
/** Create HTTP server */
const server = http.createServer(app);
/** Listen on provided port, on all network interfaces */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
    console.log(`Listening on port:: http://localhost:${port}/`)
})
const express = require ("express");
const passport = require ("passport");
const {isLoggedIn} = require('../middleware');
//controllers
const user = require ("../controllers/user.js");

const router = express.Router();

router
    .get('/login', user.getLogin)
   	.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), user.onGetUserByUsername)
    //.get('/login:id', user.onGetUserById)
    //.delete('/:id', user.onDeleteUserById)

	.get('/register', user.getRegister)
	.post('/register', user.onCreateUser)

	.get('/dashboard',isLoggedIn, function(req, res){
	// if(!req.session.user_id) {
	// return	res.redirect('/login')
	// }
	res.render("user/dashboard");
	})

	.post('/logout', (req,res) => {
		req.logout();
		req.flash('success',"GoodBye");
		res.redirect('/login');
	})

	.get('/forgotPassword', function(req, res){
	res.render("user/forgotPassword")
	
	.post('/forgotPassword', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
		  console.log(user.email);
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('user/forgotPassword');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
			console.log(user)
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: '@gmail.com',
          pass: process.env.GMAIL_PW
        },
      });
      var mailOptions = {
        to: user.email,
        from: 'info@lightuplink.com',
        subject: 'NoReply Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgotPassword');
  });
});
});
	
/**	.post('confirmation', user.confirmationPost)
	.post('/resend', user.resendTokenPost )
*/
module.exports = router;
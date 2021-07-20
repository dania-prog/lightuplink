const passport = require("passport");
const User = require("../models/user");


module.exports = {
    
	 getRegister:  (req, res) => {
		res.render("user/register");
	},
	onCreateUser: async (req, res) => {
	 try {
		 const {email, username, password} = req.body;
		const user = new User ({email, username});
		const registeredUser = await User.register(user, password);
		req.flash('success', 'Welcome to Lightup Link');
		res.redirect('/dashboard');
	 } catch (e){
		 req.flash ('error', e.message);
		 res.redirct('user/register')
	 }	
	},
	getLogin:  (req, res) => {
		res.render("user/login")
	},
	onGetUserByUsername:  (req, res) => {
		req.flash ('success', 'Welcome Back');
		res.redirect("/dashboard");
	}
}
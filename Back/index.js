const serverUrl = 'http://10.203.117.137:3001';
const clientUrl = 'http://10.203.117.137:3000';
const PORT = 3001;
var express = require('express')
	, passport = require('passport')
	, VkStrategy = require("passport-vkontakte").Strategy
	, cors = require("cors");;

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(new VkStrategy(
	{
		clientID: 7227007,
		clientSecret: "Q8lAKUXmmZfeGYD2rQZx",
		callbackURL: serverUrl + "/auth/vk/callback",
		scope: ['email'],
		profileFields: ['email'],
	},
	function verify(accessToken, refreshToken, params, profile, done) {
		process.nextTick(function () {
			return done(null, profile);
		});
	}
));

var app = express();

app.use(cors());
app.use(require('cookie-parser')());
app.use(require('body-parser')());
app.use(require('express-session')({ secret: 'keyboard cat' }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/user', function (req, res) {
	res.send(req.user);
});

app.get("/auth/vk", passport.authenticate("vkontakte"));

app.get('/auth/vk/callback',
	passport.authenticate('vkontakte', { failureRedirect: '/auth/vk' }),
	function (req, res) {
		res.redirect(clientUrl);
	});

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect(clientUrl);
});

app.get("/auth/vk", passport.authenticate("vkontakte"));

app.get("/auth/vk/callback",
	passport.authenticate("vkontakte"),
	(req, res) => {
		res.redirect(clientUrl);
	});

app.listen(PORT);
/**
 * Module dependencies.
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const csrf = require('lusca').csrf();
const methodOverride = require('method-override');

const _ = require('lodash');
const MongoStore = require('connect-mongo')({ session: session });
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const connectAssets = require('connect-assets');

/**
 * Load controllers.
 */

const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const apiController = require('./controllers/api');
const pagesController = require('./controllers/pages');
const contactController = require('./controllers/contact');

/**
 * API keys + Passport configuration.
 */

const secrets = require('./config/secrets');
const passportConf = require('./config/passport');

/**
 * Create Express server.
 */

const app = express();

/**
 * Mongoose configuration.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

const hour = 3600000;
const day = hour * 24;
const week = day * 7;

/**
 * CSRF whitelist.
 */

const csrfExclude = ['/url1', '/url2'];

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')],
  helperContext: app.locals
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({
    url: secrets.db,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  // CSRF protection.
  if (_.includes(csrfExclude, req.path)) return next();
  csrf(req, res, next);
});
app.use(function(req, res, next) {
  // Make user object available in templates.
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  // Remember original destination before login.
  const path = req.path.split('/')[1];
  if (/auth|signin|logout|signup|fonts|favicon/i.test(path)) {
    return next();
  }
  req.session.returnTo = req.path;
  next();
});

app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));

app.locals.pretty = false;

/**
 * Application routes.
 */

app.get('/', homeController.index);
app.get('/signin', userController.getSignin);
app.post('/signin', userController.postSignin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/dashboard', passportConf.isAuthenticated, userController.getAccount);
app.post('/dashboard/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.get('/dashboard/settings', passportConf.isAuthenticated, userController.getDashboardSettings);
app.get('/dashboard/verifications', passportConf.isAuthenticated, userController.getDashboardVerifications);

app.get('/dashboard/change-password', passportConf.isAuthenticated, userController.getDashboardPassword);
app.post('/dashboard/change-password', passportConf.isAuthenticated, userController.postDashboardPassword);
app.post('/dashboard/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/dashboard/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);
app.get('/api', apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/steam', apiController.getSteam);
app.get('/api/cheerio', apiController.getCheerio);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/clockwork', apiController.getClockwork);
app.post('/api/clockwork', apiController.postClockwork);
app.get('/api/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTumblr);
app.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTwitter);
app.get('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getVenmo);
app.post('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postVenmo);
app.get('/api/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getLinkedin);
app.get('/api/d3', apiController.getD3);


/** Stripe API **/
app.get('/api/stripe', apiController.getStripe);
app.get('/api/stripe/charge', apiController.getStripeCharge);
app.post('/api/stripe/onetime', apiController.postStripeCharge);
app.get('/api/stripe/subscriptions', apiController.getStripeSubscriptions);
app.post('/api/stripe/subscriptions', apiController.postStripeSubscriptions);
app.get('/api/stripe/customers', apiController.getStripeCustomers);

/** Pages Routes **/
app.get('/pages/jobs', pagesController.getJobs);
app.get('/pages/our-team', pagesController.getOurTeam);
app.get('/pages/press', pagesController.getPress);
app.get('/pages/how-it-works', pagesController.getHowItWorks);
app.get('/pages/terms-of-use', pagesController.getTermsOfUse);
app.get('/pages/privacy-policy', pagesController.getPrivacyPolicy);
app.get('/pages/about-us', pagesController.getAboutUs);
app.get('/pages/faqs', pagesController.getFaqs);
app.get('/pages/getting-started', pagesController.getGettingStarted);
app.get('/pages/contact-us', contactController.getContact);
app.post('/pages/contact-us', contactController.postContact);

/**
 * OAuth routes for sign-in.
 */

app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/signin' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/signin' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/signin' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/signin' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/signin' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/signin' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth routes for API examples that require authorization.
 */

app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/tumblr');
});
app.get('/auth/venmo', passport.authorize('venmo', { scope: 'make_payments access_profile access_balance access_email access_phone' }));
app.get('/auth/venmo/callback', passport.authorize('venmo', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/venmo');
});

/**
 * 404 Error Handler.
 */

app.use(function(req, res) {
  res.status(404);
  res.render('404', {title: 'Error 404 - Page Not Found'});
});


/**
 * 500 Error Handler.
 */

app.use(errorHandler());

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});

module.exports = app;

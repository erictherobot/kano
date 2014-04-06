/**
 * GET /
 * Home page.
 */

/**
 * GET /pages/about-us
 * About Us
 */

exports.getAboutUs = function(req, res) {
  res.render('pages/about-us', {
    title: 'About Us'
  });
};

/**
 * GET /pages/faqs
 * FAQs
 */

exports.getFaqs = function(req, res) {
  res.render('pages/faqs', {
    title: 'FAQs'
  });
};

/**
 * GET /pages/how-it-works
 * How It Works
 */

exports.getHowItWorks = function(req, res) {
  res.render('pages/how-it-works', {
    title: 'How It Works'
  });
};

/**
 * GET /pages/getting-started
 * Getting Started
 */

exports.getGettingStarted = function(req, res) {
  res.render('pages/getting-started', {
    title: 'Getting Started'
  });
};


/**
 * GET /pages/terms-of-use
 * Terms Of Use
 */

exports.getTermsOfUse = function(req, res) {
  res.render('pages/terms-of-use', {
    title: 'Terms Of Use'
  });
};

/**
 * GET /pages/privacy-policy
 * Privacy Policy
 */

exports.getPrivacyPolicy = function(req, res) {
  res.render('pages/privacy-policy', {
    title: 'Privacy Policy'
  });
};

/**
 * GET /pages/our-team
 * Our Team
 */

exports.getOurTeam = function(req, res) {
  res.render('pages/our-team', {
    title: 'Our Team'
  });
};

/**
 * GET /pages/press
 * Press
 */

exports.getPress = function(req, res) {
  res.render('pages/press', {
    title: 'Press'
  });
};

/**
 * GET /pages/jobs
 * Jobs
 */

exports.getJobs = function(req, res) {
  res.render('pages/jobs', {
    title: 'Jobs'
  });
};


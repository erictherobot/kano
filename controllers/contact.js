const secrets = require('../config/secrets');
const nodemailer = require("nodemailer");
const smtpTransport = nodemailer.createTransport('SMTP', {
 service: 'Mailgun',
 auth: {
   user: secrets.mailgun.login,
   pass: secrets.mailgun.password
 }
  // service: 'SendGrid',
  // auth: {
  //      user: secrets.sendgrid.user,
  //      pass: secrets.sendgrid.password
  // }
});

/**
 * GET /contact
 * Contact form page.
 */

exports.getContact = function(req, res) {
  res.render('contact', {
    title: 'Contact Us'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 * @param email
 * @param name
 * @param message
 */

exports.postContact = function(req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  const from = req.body.email;
  const name = req.body.name;
  const body = req.body.message;
  const to = 'your@email.com';
  const subject = 'Contact From Kano';

  const mailOptions = {
    to: to,
    from: from,
    subject: subject,
    text: body
  };

  smtpTransport.sendMail(mailOptions, function(err) {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/contact');
  });
};

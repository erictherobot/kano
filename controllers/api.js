var secrets = require('../config/secrets');
var User = require('../models/User');
var querystring = require('querystring');
var validator = require('validator');
var async = require('async');
var cheerio = require('cheerio');
var request = require('request');
var _ = require('lodash');
var graph = require('fbgraph');
var LastFmNode = require('lastfm').LastFmNode;
var tumblr = require('tumblr.js');
var foursquare = require('node-foursquare')({ secrets: secrets.foursquare });
var Github = require('github-api');
var Twit = require('twit');
var stripe =  require('stripe')(secrets.stripe.apiKey);
var d3 = require('d3');
var twilio = require('twilio')(secrets.twilio.sid, secrets.twilio.token);
var Linkedin = require('node-linkedin')(secrets.linkedin.clientID, secrets.linkedin.clientSecret, secrets.linkedin.callbackURL);
var clockwork = require('clockwork')({key: secrets.clockwork.apiKey});

/**
 * GET /api
 * List of API examples.
 */

exports.getApi = function(req, res) {
  res.render('api/index', {
    title: 'API'
  });
};

/**
 * GET /api/d3
 * D3 examples.
 */

exports.getD3 = function(req, res) {
  res.render('api/d3', {
    title: 'D3 Examples'
  });
};

/**
 * GET /api/foursquare
 * Foursquare API example.
 */

exports.getFoursquare = function(req, res, next) {
  var token = _.findWhere(req.user.tokens, { kind: 'foursquare' });
  async.parallel({
    trendingVenues: function(callback) {
      foursquare.Venues.getTrending('40.7222756', '-74.0022724', { limit: 50 }, token.accessToken, function(err, results) {
        callback(err, results);
      });
    },
    venueDetail: function(callback) {
      foursquare.Venues.getVenue('49da74aef964a5208b5e1fe3', token.accessToken, function(err, results) {
        callback(err, results);
      });
    },
    userCheckins: function(callback) {
      foursquare.Users.getCheckins('self', null, token.accessToken, function(err, results) {
        callback(err, results);
      });
    }
  },
  function(err, results) {
    if (err) return next(err);
    res.render('api/foursquare', {
      title: 'Foursquare API',
      trendingVenues: results.trendingVenues,
      venueDetail: results.venueDetail,
      userCheckins: results.userCheckins
    });
  });
};

/**
 * GET /api/tumblr
 * Tumblr API example.
 */

exports.getTumblr = function(req, res) {
  var token = _.findWhere(req.user.tokens, { kind: 'tumblr' });
  var client = tumblr.createClient({
    consumer_key: secrets.tumblr.consumerKey,
    consumer_secret: secrets.tumblr.consumerSecret,
    token: token.accessToken,
    token_secret: token.tokenSecret
  });
  client.posts('goddess-of-imaginary-light.tumblr.com', { type: 'photo' }, function(err, data) {
    res.render('api/tumblr', {
      title: 'Tumblr API',
      blog: data.blog,
      photoset: data.posts[0].photos
    });
  });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */

exports.getFacebook = function(req, res, next) {
  var token = _.findWhere(req.user.tokens, { kind: 'facebook' });
  graph.setAccessToken(token.accessToken);
  async.parallel({
    getMe: function(done) {
      graph.get(req.user.facebook, function(err, me) {
        done(err, me);
      });
    },
    getMyFriends: function(done) {
      graph.get(req.user.facebook + '/friends', function(err, friends) {
        done(err, friends.data);
      });
    }
  },
  function(err, results) {
    if (err) return next(err);
    res.render('api/facebook', {
      title: 'Facebook API',
      me: results.getMe,
      friends: results.getMyFriends
    });
  });
};

/**
 * GET /api/scraping
 * Web scraping example using Cheerio library.
 */

exports.getCheerio = function(req, res, next) {
  request.get('https://news.ycombinator.com/', function(err, request, body) {
    if (err) return next(err);
    var $ = cheerio.load(body);
    var links = [];
    $(".title a[href^='http'], a[href^='https']").each(function() {
      links.push($(this));
    });
    res.render('api/cheerio', {
      title: 'Cheerio API',
      links: links
    });
  });
};

/**
 * GET /api/github
 * GitHub API Example.
 */
exports.getGithub = function(req, res) {
  var token = _.findWhere(req.user.tokens, { kind: 'github' });
  var github = new Github({ token: token.accessToken });
  var repo = github.getRepo('erictherobot', 'kano');
  repo.show(function(err, repo) {
    res.render('api/github', {
      title: 'GitHub API',
      repo: repo
    });
  });

};

/**
 * GET /api/aviary
 * Aviary image processing example.
 */

exports.getAviary = function(req, res) {
  res.render('api/aviary', {
    title: 'Aviary API'
  });
};

/**
 * GET /api/nyt
 * New York Times API example.
 */

exports.getNewYorkTimes = function(req, res, next) {
  var query = querystring.stringify({ 'api-key': secrets.nyt.key, 'list-name': 'young-adult' });
  var url = 'http://api.nytimes.com/svc/books/v2/lists?' + query;
  request.get(url, function(error, request, body) {
    if (request.statusCode === 403) return next(Error('Missing or Invalid New York Times API Key'));
    var bestsellers = JSON.parse(body);
    res.render('api/nyt', {
      title: 'New York Times API',
      books: bestsellers.results
    });
  });
};

/**
 * GET /api/lastfm
 * Last.fm API example.
 */

exports.getLastfm = function(req, res, next) {
  var lastfm = new LastFmNode(secrets.lastfm);
  async.parallel({
    artistInfo: function(done) {
      lastfm.request("artist.getInfo", {
        artist: 'Epica',
        handlers: {
          success: function(data) {
            done(null, data);
          },
          error: function(err) {
            done(err);
          }
        }
      });
    },
    artistTopAlbums: function(done) {
      lastfm.request("artist.getTopAlbums", {
        artist: 'Epica',
        handlers: {
          success: function(data) {
            var albums = [];
            _.each(data.topalbums.album, function(album) {
              albums.push(album.image.slice(-1)[0]['#text']);
            });
            done(null, albums.slice(0, 4));
          },
          error: function(err) {
            done(err);
          }
        }
      });
    }
  },
  function(err, results) {
    if (err) return next(err.message);
    var artist = {
      name: results.artistInfo.artist.name,
      image: results.artistInfo.artist.image.slice(-1)[0]['#text'],
      tags: results.artistInfo.artist.tags.tag,
      bio: results.artistInfo.artist.bio.summary,
      stats: results.artistInfo.artist.stats,
      similar: results.artistInfo.artist.similar.artist,
      topAlbums: results.artistTopAlbums
    };
    res.render('api/lastfm', {
      title: 'Last.fm API',
      artist: artist
    });
  });
};

/**
 * GET /api/twitter
 * Twiter API example.
 */

exports.getTwitter = function(req, res, next) {
  var token = _.findWhere(req.user.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: secrets.twitter.consumerKey,
    consumer_secret: secrets.twitter.consumerSecret,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.get('search/tweets', { q: 'Kano since:2013-01-01', geocode: '40.71448,-74.00598,5mi', count: 50 }, function(err, reply) {
    if (err) return next(err);
    res.render('api/twitter', {
      title: 'Twitter API',
      tweets: reply.statuses
    });
  });
};

/**
 * GET /api/stripe
 * Stripe API example.
 */

exports.getStripe = function(req, res, next) {
    //Create a token for the CC
    res.render('api/stripe/index', {
        title: 'Stripe API'
    });
};

exports.getStripeCharge = function(req, res, next) {
    //Create a token for the CC
    res.render('api/stripe/charge', {
        title: 'Stripe API'
    });
};

exports.postStripeCharge = function(req, res, next) {
    stripe.tokens.create({
      card: {
        "number": req.body.ccNumber,
        "exp_month": req.body.expMonth,
        "exp_year": req.body.expYear,
        "cvc": req.body.cvc
      }
    }, function(err, token) {
        if (err) {
            req.flash('errors', { msg: err.message });
            return res.redirect('/api/stripe/charge');
        }
        //Create a new customer
        stripe.customers.create({
            card: token.id,
            description: req.body.customerName,
            email: req.body.email
        }).then(function(customer) {
            //charge the customer
            stripe.charges.create({
                amount: req.body.chargeAmount * 100, // amount in cents
                currency: "usd",
                customer: customer.id
            }, function(err, charge) {
                if (err) {
                    req.flash('errors', { msg: err.message });
                    return res.redirect('/api/stripe/charge');
                }else{
                    req.flash('success', { msg: 'Charged Successfully'});
                    res.render('api/stripe/charge', {
                        title: 'Stipe API',
                        customer: customer,
                        charge: charge
                    });
                }
            });
        });
    });
};


exports.getStripeSubscriptions = function(req, res, next) {
    stripe.plans.list(function(err, plans) {
        res.render('api/stripe/subscriptions', {
            title: 'Stripe API',
            plans: _.pluck(plans.data, 'name')
        });
    });
};

exports.postStripeSubscriptions = function(req, res, next) {
    console.log(req.body.plantype);
    stripe.tokens.create({
      card: {
        "number": req.body.ccNumber,
        "exp_month": req.body.expMonth,
        "exp_year": req.body.expYear,
        "cvc": req.body.cvc
      }
    }, function(err, token) {
        if (err) {
            req.flash('errors', { msg: err.message });
            return res.redirect('/api/stripe/subscriptions');
        }
        //Create a new customer
        stripe.customers.create({
            card: token.id,
            description: req.body.customerName,
            email: req.body.email
        }).then(function(customer) {
            //charge the customer
            stripe.customers.createSubscription(
              customer.id,
              {plan: req.body.plantype},
              function(err, subscription) {
                if (err) {
                    req.flash('errors', { msg: err.message });
                    return res.redirect('/api/stripe/subscriptions');
                }else{
                    stripe.plans.list(function(err, plans) {
                        req.flash('success', { msg: 'Subscribed Successfully'});
                        res.render('api/stripe/subscriptions', {
                            title: 'Stipe API',
                            customer: customer,
                            subscription: subscription,
                            plans: _.pluck(plans.data, 'name')
                        });
                    });
                }
              }
            );
        });
    });
};

exports.getStripeCustomers = function(req, res, next) {
    stripe.customers.list(function(err, customers) {
        customersList = JSON.stringify(customers.data);
        res.render('api/stripe/customers', {
            title: 'Stripe API',
            customers: customersList
        });
    });
};


/**
 * GET /api/steam
 * Steam API example.
 */

exports.getSteam = function(req, res, next) {
  var steamId = '76561197982488301';
  var query = { l: 'english', steamid: steamId, key: secrets.steam.apiKey };

  async.parallel({
    playerAchievements: function(done) {
      query.appid = '49520';
      var qs = querystring.stringify(query);
      request.get({ url: 'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?' + qs, json: true }, function(error, request, body) {
        if (request.statusCode === 401) return done(new Error('Missing or Invalid Steam API Key'));
        done(error, body);
      });
    },
    playerSummaries: function(done) {
      query.steamids = steamId;
      var qs = querystring.stringify(query);
      request.get({ url: 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?' + qs, json: true }, function(error, request, body) {
        if (request.statusCode === 401) return done(new Error('Missing or Invalid Steam API Key'));
        done(error, body);
      });
    },
    ownedGames: function(done) {
      query.include_appinfo = 1;
      query.include_played_free_games = 1;
      var qs = querystring.stringify(query);
      request.get({ url: 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?' + qs, json: true }, function(error, request, body) {
        if (request.statusCode === 401) return done(new Error('Missing or Invalid Steam API Key'));
        done(error, body);
      });
    }
  },
  function(err, results) {
    if (err) return next(err);
    res.render('api/steam', {
      title: 'Steam Web API',
      ownedGames: results.ownedGames.response.games,
      playerAchievemments: results.playerAchievements.playerstats,
      playerSummary: results.playerSummaries.response.players[0]
    });
  });
};

/**
 * GET /api/twilio
 * Twilio API example.
 */

exports.getTwilio = function(req, res, next) {
  res.render('api/twilio', {
    title: 'Twilio API'
  });
};

/**
 * POST /api/twilio
 * Twilio API example.
 * @param telephone
 */

exports.postTwilio = function(req, res, next) {
  var message = {
    to: req.body.telephone,
    from: '+3474710386',
    body: 'Hey there from Kano'
  };
  twilio.sendMessage(message, function(err, responseData) {
    if (err) return next(err.message);
    req.flash('success', { msg: 'Text sent to ' + responseData.to + '.'})
    res.redirect('/api/twilio');
  });
};

/**
 * GET /api/clockwork
 * Clockwork SMS API example.
 */

exports.getClockwork = function(req, res) {
  res.render('api/clockwork', {
    title: 'Clockwork SMS API'
  });
};

/**
 * POST /api/clockwork
 * Clockwork SMS API example.
 * @param telephone
 */

exports.postClockwork = function(req, res, next) {
  var message = {
    To: req.body.telephone,
    From: 'Kano',
    Content: 'hey there from Kano'
  };
  clockwork.sendSms(message, function(err, responseData) {
    if (err) return next(err.errDesc);
    req.flash('success', { msg: 'Text sent to ' + responseData.responses[0].to });
    res.redirect('/api/clockwork');
  });
};

/**
 * GET /api/venmo
 * Venmo API example.
 */

exports.getVenmo = function(req, res, next) {
  var token = _.findWhere(req.user.tokens, { kind: 'venmo' });
  var query = querystring.stringify({ access_token: token.accessToken });

  async.parallel({
    getProfile: function(done) {
      request.get({ url: 'https://api.venmo.com/v1/me?' + query, json: true }, function(err, request, body) {
        done(err, body);
      });
    },
    getRecentPayments: function(done) {
      request.get({ url: 'https://api.venmo.com/v1/payments?' + query, json: true }, function(err, request, body) {
        done(err, body);

      });
    }
  },
  function(err, results) {
    if (err) return next(err);
    res.render('api/venmo', {
      title: 'Venmo API',
      profile: results.getProfile.data,
      recentPayments: results.getRecentPayments.data
    });
  });
};

/**
 * POST /api/venmo
 * @param user
 * @param note
 * @param amount
 * Send money.
 */

exports.postVenmo = function(req, res, next) {
  req.assert('user', 'Phone, Email or Venmo User ID cannot be blank').notEmpty();
  req.assert('note', 'Please enter a message to accompany the payment').notEmpty();
  req.assert('amount', 'The amount you want to pay cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/venmo');
  }

  var token = _.findWhere(req.user.tokens, { kind: 'venmo' });

  var formData = {
    access_token: token.accessToken,
    note: req.body.note,
    amount: req.body.amount
  };

  if (validator.isEmail(req.body.user)) {
    formData.email = req.body.user;
  } else if (validator.isNumeric(req.body.user) &&
    validator.isLength(req.body.user, 10, 11)) {
    formData.phone = req.body.user;
  } else {
    formData.user_id = req.body.user;
  }

  request.post('https://api.venmo.com/v1/payments', { form: formData }, function(err, request, body) {
    if (err) return next(err);
    if (request.statusCode !== 200) {
      req.flash('errors', { msg: JSON.parse(body).error.message });
      return res.redirect('/api/venmo');
    }
    req.flash('success', { msg: 'Venmo money transfer complete' });
    res.redirect('/api/venmo');
  });
};

/**
 * GET /api/linkedin
 * LinkedIn API example.
 */

exports.getLinkedin = function(req, res, next) {
  var token = _.findWhere(req.user.tokens, { kind: 'linkedin' });
  var linkedin = Linkedin.init(token.accessToken);

  linkedin.people.me(function(err, $in) {
    if (err) return next(err);
    res.render('api/linkedin', {
      title: 'LinkedIn API',
      profile: $in
    });
  });
};

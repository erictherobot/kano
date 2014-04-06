var request = require('supertest');
var app = require('../app.js');

describe('GET /', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /signin', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/signin')
      .expect(200, done);
  });
});

describe('GET /signup', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/signup')
      .expect(200, done);
  });
});

describe('GET /api', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/api')
      .expect(200, done);
  });
});

describe('GET /contact', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/pages/contact-us')
      .expect(200, done);
  });
});

describe('GET /pages/about-us', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/pages/about-us')
      .expect(200, done);
  });
});

describe('GET /pages/faqs', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/pages/faqs')
      .expect(200, done);
  });
});

describe('GET /pages/getting-started', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/pages/getting-started')
      .expect(200, done);
  });
});

describe('GET /pages/how-it-works', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/pages/how-it-works')
      .expect(200, done);
  });
});

describe('GET /pages/jobs', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/pages/jobs')
      .expect(200, done);
  });
});

describe('GET /pages/our-team', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/pages/our-team')
      .expect(200, done);
  });
});

describe('GET /pages/press', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/pages/press')
      .expect(200, done);
  });
});

describe('GET /pages/privacy-policy', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/pages/privacy-policy')
      .expect(200, done);
  });
});

describe('GET /pages/terms-of-use', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/pages/terms-of-use')
      .expect(200, done);
  });
});

describe('GET /random-url', function() {
  it('should return 404', function(done) {
    request(app)
      .get('/reset')
      .expect(404, done);
  });
});
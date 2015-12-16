var express = require('express');
var router = express.Router();

var api = require('../controllers/api');
var user = require('../controllers/user');
var friend = require('../controllers/friend');

var isLoggedIn = function(req) {
  return !!(req.session && req.session.user);
};

// Middleware that redirects a route to '/'
// if the user is not logged in.
var loggedIn = function(req, res, next) {
  if (isLoggedIn(req)) {
    return next();
  }
  res.redirect('/');
};

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {
      user: req.session.user || null
    });
  });

  app.post('/login', user.login);
  app.post('/logout', user.logout);
  app.post('/signup', user.signup);
  app.get('/users/regex-search/:search', user.regexSearch);

  app.get('/request-friend/:email', loggedIn, friend.request);
  app.get('/confirm-friend/:email', loggedIn, friend.confirmRequest);
  app.get('/deny-friend/:email', loggedIn, friend.denyRequest);

  // JSON endpoints
  app.get('/api/users/:id', loggedIn, api.User.findById);
  app.put('/api/users/:id', loggedIn, api.User.update);
  app.get('/api/users/:id/friendships', loggedIn, api.User.getFriendships);
  app.get('/api/users/:id/news-feed', loggedIn, api.User.getNewsFeed);
  app.get('/api/users/:id/profile-feed', loggedIn, api.User.getProfileFeed);

  app.get('/api/statuses/:id', loggedIn, api.Status.findById);
  app.post('/api/statuses', loggedIn, api.Status.post);

  // Here '/item' refers to any type of data referred to by an Action
  app.get('/api/item/:id/comments', loggedIn, api.Comment.getCommentsOnItem);
};

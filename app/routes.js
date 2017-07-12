var steem = require('./steem.service');
const STEEM = 'steem';
const GOLOS = 'golos';
module.exports = function (app) {

  app.get('/api/steem/trending/:tag/:guid', function (req, res) {
    steem.getTrending(STEEM, req.params.guid, req.params.tag, 6, function (err, posts) {
      res.send(posts);
    })
  });

  app.get('/api/steem/recent/:tag', function (req, res) {
    steem.getRecent(STEEM, req.params.tag, 6, function (err, posts) {
      res.send(posts);
    })
  });

  app.get('/api/golos/trending/:tag/:guid', function (req, res) {
    steem.getTrending(GOLOS, req.params.guid, req.params.tag, 6, function (err, posts) {
      res.send(posts);
    })
  });

  app.get('/api/golos/recent/:tag', function (req, res) {
    steem.getRecent(GOLOS, req.params.tag, 6, function (err, posts) {
      res.send(posts);
    })
  });
  
  app.get('/api/steem/@:author/:permlink/replies', function(req, res) {
    steem.getReplies(STEEM, req.params.author, req.params.permlink, function (err, posts) {
      res.send(posts);
    })
  })
  
  app.get('/api/golos/@:author/:permlink/replies', function(req, res) {
    steem.getReplies(GOLOS, req.params.author, req.params.permlink, function (err, posts) {
      res.send(posts);
    })
  })
  
  app.get('/api/steem/@:author/:permlink', function(req, res) {
    steem.getContent(STEEM, req.params.author, req.params.permlink, function (err, posts) {
      res.send(posts);
    })
  })
  
  app.get('/api/golos/@:author/:permlink', function(req, res) {
    steem.getContent(GOLOS, req.params.author, req.params.permlink, function (err, posts) {
      res.send(posts);
    })
  })
  
  app.get('/api/steem/@:author', function(req, res) {
    steem.getAccount(STEEM, req.params.author, function (err, data) {
      res.send(data);
    })
  })
  
  app.get('/api/golos/@:author', function(req, res) {
    steem.getAccount(GOLOS, req.params.author, function (err, data) {
      res.send(data);
    })
  })    
    
  app.delete('/api/cache/:guid', function (req, res) {
    steem.deleteCache(req.params.guid);
  });
  
};
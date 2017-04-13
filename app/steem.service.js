var config = require('../config.json');
var rpc = require('json-rpc2');
var markdown = require('markdown');
var decoder = require('html-entities').AllHtmlEntities;
var utils = require('./utils');
var he = require('he');
var gold = require('./gold.service');
var moment = require('moment');

var log4js = require('log4js');
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/server.log'), 'server');
var log = log4js.getLogger('server');

var steem = {
  steem: rpc.Client.$create(config.steem.port, config.steem.host),
  golos: rpc.Client.$create(config.golos.port, config.golos.host)
};
const URL_PREFIX = {
  steem: 'https://steemit.com',
  golos: 'https://golos.io'
};
const IMG_PREFIX = {
  steem: 'https://steemitimages.com',
  golos: 'https://steemitimages.com'
};
const DEFAULT_IMG = {
  steem: '/img/default-img.jpg',
  golos: '/img/default-img.jpg'
};

const DEFAULT_AVR = {
  steem: '/img/avatar.svg',
  golos: '/img/avatar.svg'
};

const PREVIEW_LENGTH = 130;

var CURRENCY = {
  steem: {
    prefix: '$',
    multiplier: 1,
    gold: false
  },
  golos: {
    prefix: '₽ ',
    multiplier: 1,
    gold: true
  }
};

var avatars = {
  steem: {},
  golos: {}
};

function prepareCurrency(media, callback) {
  if (CURRENCY[media].gold) {
    gold.getGoldPrice(function (price) {
      CURRENCY[media].multiplier = price / 1000;
      callback();
    });
  } else {
    callback();
  }
}

function preparePosts(media, recent, posts, callback) {
  prepareCurrency(media, function () {
    posts = posts.map(function (post) {
      var postdata = {};
      postdata.title = post.title;
      postdata.url = URL_PREFIX[media] + post.url;
      postdata.posted = Date.now() - Date.parse(post.created);
      postdata.author = post.author;
      postdata.author_url = URL_PREFIX[media] + '/@' + post.author;
      if (recent) {
        return postdata
      };
      postdata.image = setImage(media, post.json_metadata);
      var payout = parseFloat(post.pending_payout_value) + parseFloat(post.total_payout_value) + parseFloat(post.curator_payout_value);
      postdata.payout = CURRENCY[media].prefix + (payout * CURRENCY[media].multiplier).toFixed(2);
      postdata.payout_declined = parseInt(post.max_accepted_payout) ? false : true;
      postdata.children = post.children;
      postdata.preview = '';
      if (post.body) {
        var preview = post.body.replace(/<[^>]+>/gm, '');
        preview = decoder.decode(markdown.parse(preview)).replace(/<[^>]+>/gm, '');
        preview = he.decode(preview);
        preview = utils.cutLinks(preview, PREVIEW_LENGTH).substring(0, PREVIEW_LENGTH);
        if (preview.length == PREVIEW_LENGTH) {
          var index = preview.split('').lastIndexOf(' ');
          postdata.preview = preview.substring(0, index) + '...';
        } else {
          postdata.preview = preview;
        }
      }
      return postdata;
    });
    loadAvatars(media, posts, callback);
  });
}

function setImage(media, metadata) {
  if (metadata.length == 0) {
    return DEFAULT_IMG[media];
  }

  var object = JSON.parse(metadata);
  if (!object.image && object.images) {
    object.image = object.images
  }

  return (object.image) ? IMG_PREFIX[media] + '/640x400/' + object.image[0] : DEFAULT_IMG[media];
}

function loadAvatars(media, posts, callback) {
  var authors = posts.map(function (post) {
    return post.author;
  }).filter(function (author) {
    return !avatars[media][author];
  });

  if (authors.length == 0) {
    posts = posts.map(function (post) {
      post.avatar = avatars[media][post.author];
      return post;
    });
    callback(null, posts);
    return;
  }

  steem[media].call('get_accounts', [authors], function (err, accounts) {
    if (err) {
      log.error("Something went wrong with", media, err);
      loadAvatars(media, posts, callback);
      return;
    }
    for (var i = 0; i < accounts.length; i++) {
      try {
        var avatar = JSON.parse(accounts[i].json_metadata).profile.profile_image;
        avatars[media][accounts[i].name] = avatar ? IMG_PREFIX[media] + '/50x50/' + avatar : DEFAULT_AVR[media];
      } catch (err) {
        avatars[media][accounts[i].name] = DEFAULT_AVR[media];
      }
    }
    posts = posts.map(function (post) {
      post.avatar = avatars[media][post.author];
      return post;
    });
    callback(err, posts);
  });

}

function getTrending(media, hash, limit, callback) {
  var start = moment();
  steem[media].call('get_discussions_by_trending', [{
    tag: hash,
    limit: limit
  }], function (err, posts) {
    if (err) {
      log.error("Something went wrong with", media, err);
      getTrending(media, hash, limit, callback);
      return;
    }
    if (posts.length == 0) {
      steem[media].call('get_discussions_by_trending30', [{
        tag: hash,
        limit: limit
      }], function (err, posts) {
        if (err) {
          log.error("Something went wrong with", media, err);
          getTrending(media, hash, limit, callback);
          return;
        }
        if (posts.length == 0) {
          log.warn('FUUUUUUUUUUUUUUU ' + hash);
        }
        preparePosts(media, false, posts, callback);
      });
      return;
    }
    log.info('Loading trending ' + hash + ' takes ' + moment().diff(start, 'milliseconds') + ' millis');
    preparePosts(media, false, posts, callback);
  });
}

function getRecent(media, hash, limit, callback) {
  var start = moment();
  steem[media].call('get_discussions_by_created', [{
    tag: hash,
    limit: limit
  }], function (err, posts) {
    if (err) {
      log.error("Something went wrong with", media, err);
      getRecent(media, hash, limit, callback);
      return;
    }
    log.info('Loading recent ' + hash + ' takes ' + moment().diff(start, 'milliseconds') + ' millis');
    preparePosts(media, true, posts, callback);
  });
}

module.exports.getTrending = getTrending;
module.exports.getRecent = getRecent;
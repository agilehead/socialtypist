// Generated by CoffeeScript 1.3.1
(function() {
  var ApplicationCache, FACEBOOK_APP_ID, FACEBOOK_SECRET, MongoStore, app, conf, controllers, database, dbconf, express, findHandler, host, models, port, root, utils,
    _this = this;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  express = require('express');

  MongoStore = (require('../common/express-session-mongo')).MongoStore;

  conf = require('./conf');

  dbconf = require('../models/dbconf');

  database = new (require('../common/database')).Database(dbconf["default"]);

  models = new (require('../models')).Models(dbconf["default"]);

  controllers = require('./controllers');

  utils = require('../common/utils');

  ApplicationCache = require('../common/cache').ApplicationCache;

  FACEBOOK_APP_ID = '259516830808506';

  FACEBOOK_SECRET = '4d0e2877593e04e2f4520105b91ca522';

  app = express.createServer();

  app.use(express.bodyParser({
    uploadDir: 'public/temp/images'
  }));

  app.set("view engine", "hbs");

  app.set('view options', {
    layout: 'layouts/default'
  });

  app.use('/public', express["static"](__dirname + '/public'));

  app.use(express.favicon());

  app.use(express.cookieParser());

  app.use(express.session({
    secret: '345fdgerf',
    store: new MongoStore({
      db: 'typistsessions',
      "native": false
    })
  }));

  findHandler = function(name, getHandler) {
    return function(req, res, next) {
      var controller;
      controller = (function() {
        switch (name.toLowerCase()) {
          case 'home':
            return new controllers.HomeController();
          case 'stories':
            return new controllers.StoriesController();
          case 'admin':
            return new controllers.AdminController();
          default:
            throw 'Boom';
        }
      })();
      return getHandler(controller)(req, res, next);
    };
  };

  app.error(function(err, req, res, next) {
    console.error(err);
    return res.send('Fail Whale, yo.');
  });

  app.get('/', findHandler('home', function(c) {
    return c.index;
  }));

  app.post('/addSession', findHandler('home', function(c) {
    return c.addSession;
  }));

  app.post('/addSession_INSECURE', findHandler('home', function(c) {
    return c.addSession_INSECURE;
  }));

  app.get('/removeSession', findHandler('home', function(c) {
    return c.removeSession;
  }));

  app.get('/stories/create', findHandler('stories', function(c) {
    return c.createForm;
  }));

  app.post('/stories', findHandler('stories', function(c) {
    return c.create;
  }));

  app.get('/stories/yours', findHandler('stories', function(c) {
    return c.yours;
  }));

  app.get('/stories/:storyid', findHandler('stories', function(c) {
    return c.show;
  }));

  app.get('/stories/:storyid/edit', findHandler('stories', function(c) {
    return c.editForm;
  }));

  app.put('/stories/:storyid', findHandler('stories', function(c) {
    return c.update;
  }));

  app.post('/stories/:storyid/fork', findHandler('stories', function(c) {
    return c.fork;
  }));

  app.get('/stories/:storyid/messages', findHandler('stories', function(c) {
    return c.messages;
  }));

  app.post('/stories/:storyid/messages', findHandler('stories', function(c) {
    return c.createMessage;
  }));

  app.del('/stories/:storyid/messages/:messageid', findHandler('stories', function(c) {
    return c.deleteMessage;
  }));

  app.post('/stories/:storyid/authorRequest', findHandler('stories', function(c) {
    return c.authorRequest;
  }));

  app.post('/stories/:storyid/authors', findHandler('stories', function(c) {
    return c.addAuthor;
  }));

  app.del('/stories/:storyid/authors/:author', findHandler('stories', function(c) {
    return c.removeAuthor;
  }));

  app.post('/stories/:storyid/parts', findHandler('stories', function(c) {
    return c.createPart;
  }));

  app.put('/stories/:storyid/parts/:partid', findHandler('stories', function(c) {
    return c.updatePart;
  }));

  app.del('/stories/:storyid/parts/:partid', findHandler('stories', function(c) {
    return c.deletePart;
  }));

  app.post('/stories/:storyid/publish', findHandler('stories', function(c) {
    return c.publish;
  }));

  app.post('/stories/:storyid/upload', findHandler('stories', function(c) {
    return c.upload;
  }));

  app.get('/admin', findHandler('admin', function(c) {
    return c.index;
  }));

  app.get('/admin/logout', findHandler('admin', function(c) {
    return c.logout;
  }));

  app.get('/admin/featured', findHandler('admin', function(c) {
    return c.featured;
  }));

  app.post('/admin/featured', findHandler('admin', function(c) {
    return c.addFeatured;
  }));

  app.get('/admin/featured/:id/remove', findHandler('admin', function(c) {
    return c.removeFeatured;
  }));

  app.get('/admin/reloadSettings', findHandler('admin', function(c) {
    return c.reloadSettings;
  }));

  app.use(function(err, req, res, next) {
    return res.render('500', {
      status: err.status || 500,
      error: utils.dumpError(err),
      layout: false
    });
  });

  app.use(function(req, res, next) {
    return res.render('400', {
      status: 400,
      url: req.url,
      layout: false
    });
  });

  host = process.argv[2];

  port = process.argv[3];

  global.cachingWhale = new ApplicationCache();

  database.find('sitesettings', {}, function(err, cursor) {
    return cursor.toArray(function(err, items) {
      global.cachingWhale.add('sitesettings', items);
      return console.log('Loaded site settings.');
    });
  });

  app.listen(port);

}).call(this);

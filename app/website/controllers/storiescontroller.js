// Generated by CoffeeScript 1.2.1-pre
(function() {
  var StoriesController, controller, dbconf, fs, models,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  controller = require('./controller');

  dbconf = require('../../models/dbconf');

  models = new (require('../../models')).Models(dbconf["default"]);

  fs = require('fs');

  StoriesController = (function(_super) {

    __extends(StoriesController, _super);

    StoriesController.name = 'StoriesController';

    function StoriesController() {
      this.getPartFromBody = __bind(this.getPartFromBody, this);

      this.upload = __bind(this.upload, this);

      this.publish = __bind(this.publish, this);

      this.deletePart = __bind(this.deletePart, this);

      this.updatePart = __bind(this.updatePart, this);

      this.createPart = __bind(this.createPart, this);

      this.fork = __bind(this.fork, this);

      this.createMessage = __bind(this.createMessage, this);

      this.authorRequest = __bind(this.authorRequest, this);

      this.messages = __bind(this.messages, this);

      this.update = __bind(this.update, this);

      this.editForm = __bind(this.editForm, this);

      this.create = __bind(this.create, this);

      this.createForm = __bind(this.createForm, this);

      this.yours = __bind(this.yours, this);

      this.show = __bind(this.show, this);

      var fn, _i, _len, _ref;
      _ref = ['yours', 'createForm', 'create', 'editForm', 'update', 'createPart', 'updatePart', 'deletePart', 'publish', 'upload'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        fn = _ref[_i];
        this[fn] = this.ensureSession(this[fn]);
      }
    }

    StoriesController.prototype.show = function(req, res, next) {
      var _this = this;
      return models.Story.getById(req.params.storyid, function(err, story) {
        var author, authors, isAuthor, loginStatus, owner, owners;
        if (story) {
          loginStatus = _this.getLoginStatus(req);
          if (loginStatus.loggedIn) {
            owners = (function() {
              var _i, _len, _ref, _results;
              _ref = story.owners;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                owner = _ref[_i];
                if (owner === this.getUserId(req)) _results.push(owner);
              }
              return _results;
            }).call(_this);
            authors = (function() {
              var _i, _len, _ref, _results;
              _ref = story.authors;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                author = _ref[_i];
                if (author === this.getUserId(req)) _results.push(author);
              }
              return _results;
            }).call(_this);
            isAuthor = owners.length > 0 || authors.length > 0;
          } else {
            isAuthor = false;
          }
          return res.render('stories/show.hbs', {
            loginStatus: loginStatus,
            story: story,
            isAuthor: isAuthor
          });
        } else {
          return res.send('Story does not exist.');
        }
      });
    };

    StoriesController.prototype.yours = function(req, res, next) {
      var _this = this;
      return models.Story.getByUserId(this.getUserId, function(err, stories) {
        return res.render('stories/yours.hbs', {
          loginStatus: _this.getLoginStatus(req),
          stories: stories
        });
      });
    };

    StoriesController.prototype.createForm = function(req, res, next) {
      return res.render('stories/create.hbs', {
        loginStatus: this.getLoginStatus(req)
      });
    };

    StoriesController.prototype.create = function(req, res, next) {
      var story,
        _this = this;
      story = new models.Story();
      story.title = req.body.title;
      story.tags = req.body.tags;
      return story.save(this.getUserId(req), function() {
        return res.redirect("/stories/" + story._id + "/edit");
      });
    };

    StoriesController.prototype.editForm = function(req, res, next) {
      var _this = this;
      return models.Story.getById(req.params.storyid, function(err, story) {
        return story.getParts(function(err, parts) {
          story._objects = {
            parts: parts
          };
          return res.render('stories/edit.hbs', {
            loginStatus: _this.getLoginStatus(req),
            story: JSON.stringify(story)
          });
        });
      });
    };

    StoriesController.prototype.update = function(req, res, next) {
      var _this = this;
      return models.Story.getById(req.params.storyid, function(err, story) {
        if (req.body.title != null) story.title = req.body.title;
        if (req.body.tags != null) story.tags = req.body.tags;
        if (req.body.publishUrl != null) story.publishUrl = req.body.publishUrl;
        if (req.body.description) story.description = req.body.descriptionv;
        return story.save(_this.getUserId(req), function() {
          res.contentType('json');
          return res.send({
            success: true
          });
        });
      });
    };

    StoriesController.prototype.messages = function(req, res, next) {
      var _this = this;
      return models.Story.getById(req.params.storyid, function(err, story) {
        return story.getMessages(_this.getUserId(req), function(err, messages) {
          res.contentType('json');
          return res.send({
            success: true,
            messages: messages
          });
        });
      });
    };

    StoriesController.prototype.authorRequest = function(req, res, next) {
      var _this = this;
      return models.Story.getById(req.params.storyid, function(err, story) {
        return story.addMessage('AUTHOR_ACCESS_REQUEST', req.body.message, _this.getUserId(req), false, function() {
          res.contentType('json');
          return res.send({
            success: true
          });
        });
      });
    };

    StoriesController.prototype.createMessage = function(req, res, next) {
      var _this = this;
      return models.Story.getById(req.params.storyid, function(err, story) {
        return story.addMessage('MESSAGE', req.body.message, _this.getUserId(req), true, function() {
          res.contentType('json');
          return res.send({
            success: true
          });
        });
      });
    };

    StoriesController.prototype.fork = function(req, res, next) {
      var _this = this;
      return models.Story.getById(req.params.storyid, function(err, story) {
        return story.fork(_this.getUserId(req), function(err, forked) {
          console.log(JSON.stringify(forked));
          res.contentType('json');
          return res.send({
            success: true,
            forkedStory: forked._id
          });
        });
      });
    };

    StoriesController.prototype.createPart = function(req, res, next) {
      var _this = this;
      return models.Story.getById(req.params.storyid, function(err, story) {
        var part;
        part = _this.getPartFromBody(req.body);
        return story.createPart(part, req.body.previousParts, _this.getUserId(req), function() {
          res.contentType('json');
          return res.send({
            success: true,
            _id: part._id
          });
        });
      });
    };

    StoriesController.prototype.updatePart = function(req, res, next) {
      var _this = this;
      return models.Story.getById(req.params.storyid, function(err, story) {
        return story.updatePart(_this.getPartFromBody(req.body), _this.getUserId(req), function() {
          res.contentType('json');
          return res.send({
            success: true
          });
        });
      });
    };

    StoriesController.prototype.deletePart = function(req, res, next) {
      var _this = this;
      return models.Story.getById(req.params.storyid, function(err, story) {
        return story.deletePart(req.params.partid, _this.getUserId(req), function() {
          res.contentType('json');
          return res.send({
            success: true
          });
        });
      });
    };

    StoriesController.prototype.publish = function(req, res, next) {
      var _this = this;
      return models.Story.getById(req.params.storyid, function(err, story) {
        return story.publish(_this.getUserId(req), function() {
          res.contentType('json');
          return res.send({
            success: true
          });
        });
      });
    };

    StoriesController.prototype.upload = function(req, res, next) {
      var targetPath,
        _this = this;
      if (req.files) {
        targetPath = "./public/images/content/" + req.params.storyid + "_" + req.files.file.name;
        return fs.rename(req.files.file.path, targetPath, function(err) {
          return res.send("/public/images/content/" + req.params.storyid + "_" + req.files.file.name);
        });
      }
    };

    StoriesController.prototype.getPartFromBody = function(body) {
      var part;
      return part = new models.StoryPart(body);
    };

    return StoriesController;

  })(controller.Controller);

  exports.StoriesController = StoriesController;

}).call(this);

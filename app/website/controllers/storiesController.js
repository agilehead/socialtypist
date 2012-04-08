// Generated by CoffeeScript 1.2.1-pre
(function() {
  var StoriesController, controller, dbconf, everyauth, models,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  controller = require('./controller');

  everyauth = require('everyauth');

  dbconf = require('../../models/dbconf');

  models = new (require('../../models')).Models(dbconf["default"]);

  StoriesController = (function(_super) {

    __extends(StoriesController, _super);

    StoriesController.name = 'StoriesController';

    function StoriesController() {
      this.item = __bind(this.item, this);

      this.updatePart = __bind(this.updatePart, this);

      this.saveTitle = __bind(this.saveTitle, this);

      this.edit = __bind(this.edit, this);

      this.create_post = __bind(this.create_post, this);

      this.create = __bind(this.create, this);

      this.index = __bind(this.index, this);

      var fn, _i, _len, _ref;
      _ref = ['write', 'write_post', 'edit'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        fn = _ref[_i];
        this[fn] = this.ensureSession(this[fn]);
      }
    }

    StoriesController.prototype.index = function(req, res, next) {
      return res.render('stories/index.hbs', {
        loginStatus: this.getLoginStatus(req)
      });
    };

    StoriesController.prototype.create = function(req, res, next) {
      return res.render('stories/create.hbs', {
        loginStatus: this.getLoginStatus(req)
      });
    };

    StoriesController.prototype.create_post = function(req, res, next) {
      var story,
        _this = this;
      story = new models.Story();
      story.title = req.body.title;
      story.description = req.body.description;
      story.collaborators = parseInt(req.body.collaborators);
      story.tags = req.body.tags;
      story.messageToAuthors = req.body.messageToAuthors;
      return story.save(req.session.user, function() {
        return res.redirect("/stories/" + story._id + "/edit");
      });
    };

    StoriesController.prototype.edit = function(req, res, next) {
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

    StoriesController.prototype.saveTitle = function(req, res, next) {
      var _this = this;
      return models.Story.getById(req.params.storyid, function(err, story) {
        story.title = req.body.title;
        return story.save(req.session.user._id, function() {
          res.contentType('json');
          return res.send({
            success: true
          });
        });
      });
    };

    StoriesController.prototype.updatePart = function(req, res, next) {
      var _this = this;
      return models.Story.getById(req.params.storyid, function(err, story) {
        var part;
        if (req.body.part._id != null) {
          return story.updatePart(new models.StoryPart(req.body.part), req.session.user._id, function() {
            res.contentType('json');
            return res.send({
              success: true
            });
          });
        } else {
          part = new models.StoryPart(req.body.part);
          return story.addPart(part, req.body.previousParts, req.session.user._id, function() {
            res.contentType('json');
            return res.send({
              success: true,
              partId: part._id
            });
          });
        }
      });
    };

    StoriesController.prototype.item = function(req, res, next) {
      var _this = this;
      return models.Story.get(req.params.id, function(story) {});
    };

    return StoriesController;

  })(controller.Controller);

  exports.StoriesController = StoriesController;

}).call(this);

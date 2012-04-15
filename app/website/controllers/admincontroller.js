// Generated by CoffeeScript 1.2.1-pre
(function() {
  var AdminController, conf, controller, database, dbconf, models,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  controller = require('./controller');

  dbconf = require('../../models/dbconf');

  database = new (require('../../common/database')).Database(dbconf["default"]);

  models = new (require('../../models')).Models(dbconf["default"]);

  conf = require('../conf');

  AdminController = (function(_super) {

    __extends(AdminController, _super);

    AdminController.name = 'AdminController';

    function AdminController() {
      this.reloadSettings = __bind(this.reloadSettings, this);

      this.removeFeatured = __bind(this.removeFeatured, this);

      this.addFeatured = __bind(this.addFeatured, this);

    }

    AdminController.prototype.addFeatured = function(req, res, next) {
      var _this = this;
      if (req.query.adminKey !== conf.adminKey) {
        return res.send({
          success: false,
          message: 'BAD_KEY'
        });
      } else {
        return models.Story.getById(req.query.storyid, function(err, story) {
          var entry;
          entry = {
            type: 'FEATURED',
            story: req.query.storyid,
            content: story.cache.html
          };
          return database.insert('sitesettings', entry, function() {
            return res.send({
              success: true
            });
          });
        });
      }
    };

    AdminController.prototype.removeFeatured = function(req, res, next) {
      var _this = this;
      if (req.query.adminKey !== conf.adminKey) {
        return res.send({
          success: false,
          message: 'BAD_KEY'
        });
      } else {
        return database.remove('sitesettings', {
          type: 'FEATURED',
          story: req.query.storyid
        }, function() {
          return res.send({
            success: true
          });
        });
      }
    };

    AdminController.prototype.reloadSettings = function(req, res, next) {
      var _this = this;
      if (req.query.adminKey !== conf.adminKey) {
        return res.send({
          success: false,
          message: 'BAD_KEY'
        });
      } else {
        return database.find('sitesettings', {}, function(err, cursor) {
          return cursor.toArray(function(err, items) {
            global.cachingWhale.add('sitesettings', items);
            return res.send({
              success: true,
              message: 'Reloaded settings.'
            });
          });
        });
      }
    };

    return AdminController;

  })(controller.Controller);

  exports.AdminController = AdminController;

}).call(this);
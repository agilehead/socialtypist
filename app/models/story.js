// Generated by CoffeeScript 1.2.1-pre
(function() {
  var BaseModel, Story, async, markdown, sanitize,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  async = require('async');

  BaseModel = require('./basemodel').BaseModel;

  markdown = require("node-markdown").Markdown;

  sanitize = require("../common/mdsanitizer").sanitize;

  Story = (function(_super) {

    __extends(Story, _super);

    Story.name = 'Story';

    function Story() {
      this.isOwner = __bind(this.isOwner, this);

      this.isAuthor = __bind(this.isAuthor, this);

      this.removeOwner = __bind(this.removeOwner, this);

      this.addOwner = __bind(this.addOwner, this);

      this.removeAuthor = __bind(this.removeAuthor, this);

      this.addAuthor = __bind(this.addAuthor, this);

      this.deletePart = __bind(this.deletePart, this);

      this.updatePart = __bind(this.updatePart, this);

      this.createPart = __bind(this.createPart, this);

      this.publish = __bind(this.publish, this);

      this.save = __bind(this.save, this);

      this.getParts = __bind(this.getParts, this);
      return Story.__super__.constructor.apply(this, arguments);
    }

    Story._meta = {
      type: Story,
      collection: 'stories',
      logging: {
        isLogged: true,
        onInsert: 'NEW_STORY'
      }
    };

    Story.getById = function(id, cb) {
      return Story._database.findOne('stories', {
        '_id': Story._database.ObjectId(id)
      }, function(err, result) {
        return cb(null, result ? new Story(result) : void 0);
      });
    };

    Story.prototype.getParts = function(cb) {
      var partId,
        _this = this;
      return Story._database.find('storyparts', {
        '$or': (function() {
          var _i, _len, _ref, _results;
          _ref = this.parts;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            partId = _ref[_i];
            _results.push({
              _id: Story._database.ObjectId(partId)
            });
          }
          return _results;
        }).call(this)
      }, function(err, parts) {
        return parts.toArray(function(err, items) {
          var item, part, partId, results, _i, _len, _ref;
          results = [];
          _ref = _this.parts;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            partId = _ref[_i];
            part = ((function() {
              var _j, _len1, _results;
              _results = [];
              for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
                item = items[_j];
                if (item._id.toString() === partId) _results.push(item);
              }
              return _results;
            })())[0];
            part = new Story._models.StoryPart(part);
            results.push(part);
          }
          return cb(null, results);
        });
      });
    };

    Story.prototype.save = function(user, cb) {
      var allowedAttributes, allowedTags,
        _this = this;
      allowedTags = 'a|b|blockquote|code|del|dd|dl|dt|em|h1|h2|h3|h4|h5|h6|i|img|li|ol|p|pre|sup|sub|strong|strike|ul|br|hr';
      allowedAttributes = {
        'img': 'src|width|height|alt',
        'a': 'href',
        '*': 'title'
      };
      this.timestamp = new Date().getTime();
      if (!this._id) {
        this.createdBy = user;
        this.owners = [user];
        this.authors = [];
        this.parts = [];
        this.published = false;
        this.title = sanitize(this.title, allowedTags, allowedAttributes);
        return Story.__super__.save.call(this, function() {
          return async.series([
            (function(cb) {
              var part;
              part = new Story._models.StoryPart();
              part.type = "HEADING";
              part.size = 'H2';
              part.value = "Sample Heading. Click to edit.";
              return _this.createPart(part, null, user, cb);
            }), (function(cb) {
              var part;
              part = new Story._models.StoryPart();
              part.type = "TEXT";
              part.value = "This is some sample content. Click to edit.";
              return _this.createPart(part, [_this.parts[0]], user, cb);
            })
          ], function() {
            return cb();
          });
        });
      } else {
        if (this.isOwner(user)) {
          this.title = sanitize(this.title, allowedTags, allowedAttributes);
          return Story.__super__.save.call(this, cb);
        } else {
          throw {
            type: 'NOT_OWNER',
            message: 'You do not own this story. Cannot modify.'
          };
        }
      }
    };

    Story.prototype.publish = function(user, cb) {
      var allowedAttributes, allowedTags,
        _this = this;
      allowedTags = 'a|b|blockquote|code|del|dd|dl|dt|em|h1|h2|h3|h4|h5|h6|i|img|li|ol|p|pre|sup|sub|strong|strike|ul|br|hr';
      allowedAttributes = {
        'img': 'src|width|height|alt',
        'a': 'href',
        '*': 'title'
      };
      this.html = markdown('#' + this.title, true, allowedTags, allowedAttributes);
      return this.getParts(function(err, parts) {
        var part, _i, _len;
        for (_i = 0, _len = parts.length; _i < _len; _i++) {
          part = parts[_i];
          _this.html += part.getHtml();
        }
        return _this.save(user, cb);
      });
    };

    /*
            Adds a new part to the story.
                1. previousParts is a list of part-ids which occur before the newly added part. (Walked backwards in the DOM, if dom has #a, #b, #c, previousParts = [c,b,a])
                   Insertion will happen at the first "previous-part" found in the @parts collection.
    */


    Story.prototype.createPart = function(part, previousParts, user, cb) {
      var _this = this;
      if (this.isAuthor(user)) {
        part.author = user;
        part.story = this._id.toString();
        part.timestamp = new Date().getTime();
        return part.save(function() {
          var index, insertAt, previous, _i, _len;
          insertAt = 0;
          if (previousParts) {
            for (_i = 0, _len = previousParts.length; _i < _len; _i++) {
              previous = previousParts[_i];
              index = _this.parts.indexOf(previous);
              if (index !== -1) {
                insertAt = index + 1;
                break;
              }
            }
          }
          _this.parts.splice(insertAt, 0, part._id.toString());
          return _this.save(user, cb);
        });
      } else {
        throw {
          type: 'NOT_AUTHOR',
          message: 'You are not an author on this story. Cannot modify.'
        };
      }
    };

    Story.prototype.updatePart = function(part, user, cb) {
      if (this.isAuthor(user)) {
        part.timestamp = new Date().getTime();
        return part.save(cb);
      } else {
        throw {
          type: 'NOT_AUTHOR',
          message: 'You are not an author on this story. Cannot modify.'
        };
      }
    };

    Story.prototype.deletePart = function(part, user, cb) {
      var index;
      if (this.isAuthor(user)) {
        index = this.parts.indexOf(part);
        if (index !== -1) {
          this.parts.splice(index, 1);
          return this.save(user, cb);
        }
      } else {
        throw {
          type: 'NOT_AUTHOR',
          message: 'You are not an author on this story. Cannot modify.'
        };
      }
    };

    Story.prototype.addAuthor = function(author, user, cb) {
      if (this.isOwner(user)) {
        if (this.authors.indexOf(author === -1)) {
          this.authors.push(author);
          return this.save(user, cb);
        }
      } else {
        throw {
          type: 'NOT_OWNER',
          message: 'You do not own this story. Cannot modify.'
        };
      }
    };

    Story.prototype.removeAuthor = function(author, user, cb) {
      var u;
      if (this.isOwner(user)) {
        if (this.authors.indexOf(author > -1)) {
          this.authors = (function() {
            var _i, _len, _ref, _results;
            _ref = this.authors;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              u = _ref[_i];
              if (u !== author) _results.push(u);
            }
            return _results;
          }).call(this);
          return this.save(user, cb);
        }
      } else {
        throw {
          type: 'NOT_OWNER',
          message: 'You do not own this story. Cannot modify.'
        };
      }
    };

    Story.prototype.addOwner = function(owner, user, cb) {
      if (this.isOwner(user)) {
        if (this.owners.indexOf(owner === -1)) {
          this.owners.push(owner);
          return this.save(user, cb);
        }
      } else {
        throw {
          type: 'NOT_OWNER',
          message: 'You do not own this story. Cannot modify.'
        };
      }
    };

    Story.prototype.removeOwner = function(owner, user, cb) {
      var u;
      if (this.isOwner(user)) {
        if (this.owners.indexOf(owner > -1)) {
          this.owners = (function() {
            var _i, _len, _ref, _results;
            _ref = this.owners;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              u = _ref[_i];
              if (u !== owner) _results.push(u);
            }
            return _results;
          }).call(this);
          return this.save(user, cb);
        }
      } else {
        throw {
          type: 'NOT_OWNER',
          message: 'You do not own this story. Cannot modify.'
        };
      }
    };

    Story.prototype.isAuthor = function(user) {
      return this.owners.indexOf(user > -1 || this.authors.indexOf(user > -1));
    };

    Story.prototype.isOwner = function(user) {
      return this.owners.indexOf(user > -1);
    };

    return Story;

  }).call(this, BaseModel);

  exports.Story = Story;

}).call(this);

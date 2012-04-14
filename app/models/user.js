// Generated by CoffeeScript 1.2.1-pre
(function() {
  var BaseModel, User,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BaseModel = require('./basemodel').BaseModel;

  User = (function(_super) {

    __extends(User, _super);

    User.name = 'User';

    function User() {
      this.save = __bind(this.save, this);
      return User.__super__.constructor.apply(this, arguments);
    }

    User._meta = {
      type: User,
      collection: 'users',
      logging: {
        isLogged: true,
        onInsert: 'NEW_USER'
      }
    };

    User.prototype.save = function(cb) {
      if (!(typeof _id !== "undefined" && _id !== null)) {
        this.ownedStories = [];
        this.authoredStories = [];
        this.cache = {};
      }
      return User.__super__.save.call(this, cb);
    };

    return User;

  })(BaseModel);

  exports.User = User;

}).call(this);

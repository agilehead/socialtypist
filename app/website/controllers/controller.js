// Generated by CoffeeScript 1.3.1
(function() {
  var Controller,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Controller = (function() {

    Controller.name = 'Controller';

    function Controller() {
      this.setValues = __bind(this.setValues, this);

      this.getValue = __bind(this.getValue, this);

      this.getUserId = __bind(this.getUserId, this);

    }

    Controller.prototype.getLoginStatus = function(req) {
      var status, _ref;
      if ((_ref = req.session.user) != null ? _ref.username : void 0) {
        status = {
          loggedIn: true,
          js: "window.authProvider = '" + req.session.authProvider + "'; window.loggedIn = true; window.username = '" + req.session.user.username + "';",
          header: "<a class=\"logoutLink\" href=\"#\">Logout</a> <span class=\"username\">" + req.session.user.username + "</span>"
        };
      } else {
        status = {
          loggedIn: false,
          js: "window.loggedIn = false; window.username = null;",
          header: '<img src="/public/images/facebook.png" /><a class="fbLoginLink" href="#">Login</a>'
        };
      }
      return status;
    };

    Controller.prototype.ensureSession = function(fn) {
      return function(req, res, next) {
        if (req.session.user != null) {
          return fn(req, res, next);
        } else {
          return res.redirect('/login');
        }
      };
    };

    Controller.prototype.getUserId = function(req) {
      var _ref;
      if ((_ref = req.session.user) != null ? _ref.username : void 0) {
        return req.session.user._id.toString();
      } else {
        throw {
          type: 'NOT_LOGGED_IN'
        };
      }
    };

    Controller.prototype.getValue = function(src, field, safe) {
      if (safe == null) {
        safe = true;
      }
      return src[field];
    };

    Controller.prototype.setValues = function(target, src, fields, options) {
      var field, fsrc, ft, setValue, _i, _len, _results, _results1,
        _this = this;
      if (options == null) {
        options = {};
      }
      if (!(options.safe != null)) {
        options.safe = true;
      }
      if (!options.ignoreEmpty) {
        options.ignoreEmpty = true;
      }
      setValue = function(src, targetField, srcField) {
        var val;
        val = _this.getValue(src, srcField, options.safe);
        if (options.ignoreEmpty) {
          if (val != null) {
            return target[field] = val;
          }
        } else {
          return target[field] = val;
        }
      };
      if (fields.constructor === Array) {
        _results = [];
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          field = fields[_i];
          _results.push(setValue(src, field, field));
        }
        return _results;
      } else {
        _results1 = [];
        for (ft in fields) {
          fsrc = fields[ft];
          _results1.push(setValue(src, ft, fsrc));
        }
        return _results1;
      }
    };

    return Controller;

  })();

  exports.Controller = Controller;

}).call(this);

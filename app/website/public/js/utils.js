// Generated by CoffeeScript 1.3.1
(function() {

  this.SocialTypist = {};

  this.SocialTypist.Utils = {};

  this.SocialTypist.Utils.random = function(n) {
    return Math.floor(Math.random() * n);
  };

  this.SocialTypist.Utils.pickRandom = function(array) {
    var rand;
    rand = Math.floor(Math.random() * array.length);
    return array[rand];
  };

  this.SocialTypist.Utils.uniqueId = function(length) {
    var id;
    if (length == null) {
      length = 16;
    }
    id = "";
    while (id.length < length) {
      id += Math.random().toString(36).substr(2);
    }
    return id.substr(0, length);
  };

  this.SocialTypist.Utils.extend = function(target, source) {
    var key, val, _results;
    _results = [];
    for (key in source) {
      val = source[key];
      if (typeof val !== "function") {
        _results.push(target[key] = val);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

}).call(this);

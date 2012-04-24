// Generated by CoffeeScript 1.3.1
(function() {
  var Database, Mongo, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Mongo = require('mongodb');

  utils = require('./utils');

  Database = (function() {

    Database.name = 'Database';

    function Database(conf) {
      this.conf = conf;
      this.ObjectId = __bind(this.ObjectId, this);

      this.removeById = __bind(this.removeById, this);

      this.remove = __bind(this.remove, this);

      this.findOne = __bind(this.findOne, this);

      this.findById = __bind(this.findById, this);

      this.find = __bind(this.find, this);

      this.updateMany = __bind(this.updateMany, this);

      this.update = __bind(this.update, this);

      this.insert = __bind(this.insert, this);

      this.execute = __bind(this.execute, this);

      this.getDb = __bind(this.getDb, this);

    }

    Database.prototype.getDb = function() {
      return new Mongo.Db(this.conf.name, new Mongo.Server(this.conf.host, this.conf.port, {}), {});
    };

    Database.prototype.execute = function(task) {
      var db,
        _this = this;
      db = this.getDb();
      return db.open(function(err, db) {
        try {
          return task(db, function(err) {});
        } catch (e) {
          return utils.dumpError(e);
        }
      });
    };

    Database.prototype.insert = function(collectionName, document, cb) {
      var _this = this;
      return this.execute(function(db, completionCB) {
        return db.collection(collectionName, function(err, collection) {
          return collection.insert(document, {
            safe: true
          }, function(e, r) {
            cb(e, r[0]);
            return completionCB(e);
          });
        });
      });
    };

    Database.prototype.update = function(collectionName, document, cb) {
      var _this = this;
      return this.execute(function(db, completionCB) {
        return db.collection(collectionName, function(err, collection) {
          return collection.update({
            _id: document._id
          }, document, {
            safe: true
          }, function(e, r) {
            cb(e, r);
            return completionCB(e);
          });
        });
      });
    };

    Database.prototype.updateMany = function(collectionName, params, document, cb) {
      var _this = this;
      return this.execute(function(db, completionCB) {
        return db.collection(collectionName, function(err, collection) {
          return collection.update(params, document, {
            safe: true,
            multi: true
          }, function(e, r) {
            cb(e, r);
            return completionCB(e);
          });
        });
      });
    };

    Database.prototype.find = function(collectionName, query, cb) {
      var _this = this;
      return this.execute(function(db, completionCB) {
        return db.collection(collectionName, function(err, collection) {
          var cursor;
          cursor = collection.find(query);
          cb(err, cursor);
          return completionCB(err);
        });
      });
    };

    Database.prototype.findById = function(collectionName, id, cb) {
      return this.findOne(collectionName, {
        _id: this.ObjectId(id)
      }, cb);
    };

    Database.prototype.findOne = function(collectionName, query, cb) {
      var _this = this;
      return this.find(collectionName, query, function(err, cursor) {
        return cursor.nextObject(function(err, item) {
          return cb(err, item);
        });
      });
    };

    Database.prototype.remove = function(collectionName, params, cb) {
      var _this = this;
      return this.execute(function(db, completionCB) {
        return db.collection(collectionName, function(err, collection) {
          return collection.remove(params, {
            safe: true
          }, function(e, r) {
            cb(e, r);
            return completionCB(e);
          });
        });
      });
    };

    Database.prototype.removeById = function(collectionName, id, cb) {
      var _this = this;
      return this.execute(function(db, completionCB) {
        return db.collection(collectionName, function(err, collection) {
          return collection.remove({
            _id: _this.ObjectId(id)
          }, {
            safe: true
          }, function(e, r) {
            cb(e, r);
            return completionCB(e);
          });
        });
      });
    };

    Database.prototype.ObjectId = function(id) {
      if (typeof id === "string") {
        return new Mongo.BSONPure.ObjectID(id);
      } else {
        return id;
      }
    };

    return Database;

  })();

  exports.Database = Database;

}).call(this);

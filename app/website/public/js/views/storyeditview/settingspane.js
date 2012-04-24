// Generated by CoffeeScript 1.3.1
(function() {
  var SettingsPane,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  SettingsPane = (function() {

    SettingsPane.name = 'SettingsPane';

    function SettingsPane(story, editor, view) {
      var actionElem, all, authors, authorsElem, date, i, month, owners, prefix, slug, today, user, year, _i, _len, _ref;
      this.story = story;
      this.editor = editor;
      this.view = view;
      this.saveSettings = __bind(this.saveSettings, this);

      this.editor.find('.tab-content').html('<div class="settings-pane"></div>');
      this.container = this.editor.find('.settings-pane');
      slug = (_ref = this.story.slug) != null ? _ref : this.story.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/\ +/g, '-');
      prefix = this.story.publishedDate;
      if (!prefix) {
        today = new Date();
        year = today.getYear() + 1900;
        month = today.getMonth();
        month = month < 10 ? '0' + month : month;
        date = today.getDate();
        date = date < 10 ? '0' + date : date;
        prefix = year + month + date + '';
      }
      this.container.html("            <form class=\"story-settings-form\">                <p>                    <label>Summary</label>                    <textarea class=\"summary span6\" rows=\"6\">" + this.story.summary + "</textarea>                </p>                <p>                    <label>Tags</label>                    <input type=\"text\" value=\"" + this.story.tags + "\" class=\"tags span6\" />                </p>                <p>                    <label>Url for your story</label>                    <span class=\"light\">http://www.socialtypist.com/" + prefix + "/</span><br /><input type=\"text\" value=\"" + slug + "\" class=\"slug span6\" /><br />                </p>                <p>                    <a class=\"btn save\" href=\"#\">Save Settings</a>                </p>            </form>            <hr />");
      $('.story-settings-form .save').click(this.saveSettings);
      owners = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.story.cache.owners;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          user = _ref1[_i];
          _results.push({
            type: 'owner',
            user: user
          });
        }
        return _results;
      }).call(this);
      authors = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.story.cache.authors;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          user = _ref1[_i];
          _results.push({
            type: 'author',
            user: user
          });
        }
        return _results;
      }).call(this);
      all = owners.concat(authors);
      if (all.length) {
        this.container.append("                <h3>Authors</h3>                <ul class=\"authors iconic-summary\">                </ul>");
        authorsElem = this.container.find('.authors');
        for (_i = 0, _len = all.length; _i < _len; _i++) {
          i = all[_i];
          authorsElem.append("                    <li>                        <div class=\"icon\">                            <img src=\"http://graph.facebook.com/" + i.user.domainid + "/picture?type=square\" />                        </div>                        <div class=\"summary\">                            <h3>" + i.user.name + "</h3>                            <p class=\"author-actions\"></p>                        </div>                    </li>");
          actionElem = authorsElem.find('li p.author-actions').last();
          if (i.user._id !== this.story.createdBy) {
            if (i.type === 'owner') {
              actionElem.html('<a href="#" class="remove">remove</a>');
            }
          } else {
            actionElem.html('owner');
          }
        }
      }
    }

    SettingsPane.prototype.saveSettings = function() {
      var onResponse, slug, summary, tags,
        _this = this;
      onResponse = function() {
        return alert('saved');
      };
      tags = $('.story-settings-form .tags').val();
      summary = $('.story-settings-form .summary').val();
      slug = $('.story-settings-form .slug').val();
      $.put("/stories/" + this.story._id, {
        tags: tags,
        summary: summary,
        slug: slug
      }, onResponse);
      return false;
    };

    return SettingsPane;

  })();

  this.SocialTypist.StoryEditView.SettingsPane = SettingsPane;

}).call(this);

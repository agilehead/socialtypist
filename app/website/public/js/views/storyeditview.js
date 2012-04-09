// Generated by CoffeeScript 1.2.1-pre
(function() {
  var StoryEditView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  StoryEditView = (function() {

    StoryEditView.name = 'StoryEditView';

    function StoryEditView(story, editor) {
      this.story = story;
      this.editor = editor;
      this.getHeadingPrefix = __bind(this.getHeadingPrefix, this);

      this.createForm = __bind(this.createForm, this);

      this.makeHtml = __bind(this.makeHtml, this);

      this.addSection = __bind(this.addSection, this);

      this.removePart = __bind(this.removePart, this);

      this.cancelPartEdit = __bind(this.cancelPartEdit, this);

      this.savePart = __bind(this.savePart, this);

      this.editVideoPart = __bind(this.editVideoPart, this);

      this.editImagePart = __bind(this.editImagePart, this);

      this.editTextPart = __bind(this.editTextPart, this);

      this.editHeadingPart = __bind(this.editHeadingPart, this);

      this.editPart = __bind(this.editPart, this);

      this.renderVideoPart = __bind(this.renderVideoPart, this);

      this.renderImagePart = __bind(this.renderImagePart, this);

      this.renderTextPart = __bind(this.renderTextPart, this);

      this.renderHeadingPart = __bind(this.renderHeadingPart, this);

      this.renderPartContent = __bind(this.renderPartContent, this);

      this.createPartContainer = __bind(this.createPartContainer, this);

      this.createParts = __bind(this.createParts, this);

      this.cancelTitleEdit = __bind(this.cancelTitleEdit, this);

      this.saveTitle = __bind(this.saveTitle, this);

      this.editTitle = __bind(this.editTitle, this);

      this.createTitle = __bind(this.createTitle, this);

      this.render = __bind(this.render, this);

      this.initialize = __bind(this.initialize, this);

      this.container = $(this.editor.find('.story'));
      this.initialize();
    }

    StoryEditView.prototype.initialize = function() {
      var _this = this;
      this.showdown = new Showdown.converter();
      return this.editor.find('.publish-button').click(function() {
        return $.post("/stories/" + _this.story._id + "/publish", function() {
          return window.location.href = "/stories/" + _this.story._id;
        });
      });
    };

    StoryEditView.prototype.render = function() {
      this.createTitle();
      return this.createParts();
    };

    StoryEditView.prototype.createTitle = function() {
      var title,
        _this = this;
      this.container.append("<div class=\"editable title\"><h1 class=\"title\">" + this.story.title + "</h1></div>");
      title = this.container.find('.editable.title');
      title.data('title', this.story.title);
      return title.click(function() {
        return _this.editTitle();
      });
    };

    StoryEditView.prototype.editTitle = function() {
      var editable, val,
        _this = this;
      editable = $('#story-editor .editable.title');
      editable.unbind('click');
      editable.addClass('selected');
      val = editable.data('title');
      editable.html("            <form class=\"title-editor\">                <input type=\"text\" class=\"span6\" /><br />                <p class=\"left\"><a class=\"save btn small\" href=\"#\">Save section</a> <a class=\"cancel small action\" href=\"#\">cancel</a></p>                <hr />                <p class=\"add-section\"><span class=\"plus\">+</span><a class=\"small action insert\" href=\"#\">insert section below</a></p>            </form>");
      editable.find('.title-editor input').val(val);
      editable.find('a.save').click(function() {
        _this.saveTitle();
        return false;
      });
      editable.find('a.cancel').click(function() {
        _this.cancelTitleEdit();
        return false;
      });
      editable.find('.insert').click(function() {
        _this.addSection('start');
        return false;
      });
      return editable.find('input').keypress(function(e) {
        if (e.which === 13) {
          _this.saveTitle();
          return false;
        }
      });
    };

    StoryEditView.prototype.saveTitle = function() {
      var editable, val,
        _this = this;
      editable = $('#story-editor .editable.title');
      val = $('.title-editor input').val();
      return $.post("/stories/" + story._id + "/saveTitle", {
        title: val
      }, function(response) {
        console.log(response);
        if (response.success) {
          editable.click(function() {
            return _this.editTitle();
          });
          editable.removeClass('selected');
          editable.html("<h1 class=\"title\">" + val + "</h1>");
          return editable.data('title', val);
        }
      });
    };

    StoryEditView.prototype.cancelTitleEdit = function() {
      var editable,
        _this = this;
      editable = $('#story-editor .editable.title');
      editable.click(function() {
        return _this.editTitle();
      });
      editable.removeClass('selected');
      return editable.html("<h1 class=\"title\">" + (editable.data('title')) + "</h1>");
    };

    StoryEditView.prototype.createParts = function() {
      var editable, part, _i, _len, _ref, _results,
        _this = this;
      this.container.append('<ul id="part-editor" class="story"></ul>');
      this.container.append('<p class="add-section"><span class="plus">+</span><a class="small action" href="#">add new section</a></p>');
      this.container.find('.add-section a').click(function() {
        _this.addSection('end');
        return false;
      });
      this.editor = this.container.find('#part-editor').first();
      if (this.story._objects.parts.length) {
        _ref = this.story._objects.parts;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          part = _ref[_i];
          editable = this.createPartContainer(part, editable);
          editable.data('part', part);
          _results.push(this.renderPartContent(editable));
        }
        return _results;
      }
    };

    StoryEditView.prototype.createPartContainer = function(part, previousElement) {
      var editable;
      editable = this.editor.find("#storypart_" + part._id);
      if (!editable.length) {
        if (!previousElement || !previousElement.length) {
          this.editor.prepend("<li class=\"content editable\" id=\"storypart_" + part._id + "\"><br /></li>");
        } else {
          $("<li class=\"content editable\" id=\"storypart_" + part._id + "\"></li>").insertAfter(previousElement);
        }
        editable = this.editor.find("#storypart_" + part._id);
      }
      return editable;
    };

    StoryEditView.prototype.renderPartContent = function(editable) {
      var _this = this;
      editable.click(function() {
        return _this.editPart(editable);
      });
      switch (editable.data('part').type) {
        case 'HEADING':
          this.renderHeadingPart(editable);
          break;
        case 'TEXT':
          this.renderTextPart(editable);
          break;
        case 'IMAGE':
          this.renderImagePart(editable);
          break;
        case 'VIDEO':
          this.renderVideoPart(editable);
      }
      return editable;
    };

    StoryEditView.prototype.renderHeadingPart = function(editable) {
      var part;
      part = editable.data('part');
      return editable.html(this.makeHtml(this.getHeadingPrefix(part.size) + part.value));
    };

    StoryEditView.prototype.renderTextPart = function(editable) {
      var part;
      part = editable.data('part');
      return editable.html(this.makeHtml(part.value));
    };

    StoryEditView.prototype.renderImagePart = function(editable) {
      var alt, part, _ref;
      part = editable.data('part');
      alt = (_ref = part.alt) != null ? _ref : '';
      return editable.html("<p class=\"image-container\"><img src=\"" + part.value + "\" alt=\"" + alt + "\" /></p>");
    };

    StoryEditView.prototype.renderVideoPart = function(editable) {
      var part;
      part = editable.data('part');
      return editable.html(this.makeHtml(part.value));
    };

    StoryEditView.prototype.editPart = function(editable) {
      var part,
        _this = this;
      part = editable.data('part');
      editable.unbind('click');
      editable.addClass('selected');
      switch (part.type) {
        case 'HEADING':
          this.editHeadingPart(editable);
          break;
        case 'TEXT':
          this.editTextPart(editable);
          break;
        case 'IMAGE':
          this.editImagePart(editable);
          break;
        case 'VIDEO':
          this.editVideoPart(editable);
      }
      editable.find('.cancel').click(function() {
        _this.cancelPartEdit(editable);
        return false;
      });
      editable.find('.delete').click(function() {
        _this.removePart(editable);
        return false;
      });
      editable.find('.insert').click(function() {
        _this.addSection(editable);
        return false;
      });
      return editable.find('textarea').focus();
    };

    StoryEditView.prototype.editHeadingPart = function(editable) {
      var fnAfterSave, fnUpdatePart, part, save, _ref, _ref1,
        _this = this;
      part = editable.data('part');
      this.createForm(editable, "            <form>                <select class=\"size span2\">                    <option value=\"H2\">H2</option>                    <option value=\"H3\">H3</option>                    <option value=\"H4\">H4</option>                </select>                <br />                <input type=\"text\" class=\"span6\" value=\"" + ((_ref = part.value) != null ? _ref : '') + "\" />                <p class=\"left\">                    <a class=\"save btn small\" href=\"#\">Save section</a> <a class=\"cancel small action\" href=\"#\">cancel</a>                    <a class=\"delete action small unsafe\" href=\"#\">delete?</a>                </p>                <hr />                <p class=\"add-section\"><span class=\"plus\">+</span><a class=\"small action insert\" href=\"#\">insert section below</a></p>            </form>");
      editable.find('select').focus();
      editable.find('.size').val((_ref1 = part.size) != null ? _ref1 : 'H2');
      fnUpdatePart = function() {
        part.size = editable.find('select').val();
        return part.value = editable.find('input').val();
      };
      fnAfterSave = function() {
        return editable.html(_this.makeHtml(_this.getHeadingPrefix(part.size) + part.value));
      };
      save = function() {
        return _this.savePart(editable, fnUpdatePart, fnAfterSave);
      };
      editable.find('.save').click(save);
      return editable.find('input').keypress(function(e) {
        if (e.which === 13) return save();
      });
    };

    StoryEditView.prototype.editTextPart = function(editable) {
      var fnAfterSave, fnUpdatePart, part, rows, _ref,
        _this = this;
      part = editable.data('part');
      if (editable.height() > 480) {
        rows = 28;
      } else if (editable.height() > 240) {
        rows = 16;
      } else {
        rows = 8;
      }
      this.createForm(editable, "            <form>                <textarea rows=\"" + rows + "\">" + ((_ref = part.value) != null ? _ref : '') + "</textarea>                <p class=\"left\">                    <a class=\"save btn small\" href=\"#\">Save section</a> <a class=\"cancel small action\" href=\"#\">cancel</a>                    <a class=\"delete action small unsafe\" href=\"#\">delete?</a>                                </p>                <hr />                <p class=\"add-section\"><span class=\"plus\">+</span><a class=\"small action insert\" href=\"#\">insert section below</a></p>            </form>");
      fnUpdatePart = function() {
        return part.value = editable.find('textarea').val();
      };
      fnAfterSave = function() {
        return editable.html(_this.makeHtml(part.value));
      };
      return editable.find('.save').click(function() {
        return _this.savePart(editable, fnUpdatePart, fnAfterSave);
      });
    };

    StoryEditView.prototype.editImagePart = function(editable) {
      var fnAfterSave, fnUpdatePart, part, _ref,
        _this = this;
      part = editable.data('part');
      this.createForm(editable, "            <div class=\"with-url\">                <form>                    Image url: <input type=\"text\" class=\"url span5\" value=\"" + ((_ref = part.value) != null ? _ref : '') + "\" /> or <a href=\"#\" class=\"upload\">Upload file</a>                    <p class=\"left\">                        <a class=\"save btn small\" href=\"#\">Save section</a> <a class=\"cancel small action\" href=\"#\">cancel</a>                        <a class=\"delete action small unsafe\" href=\"#\">delete?</a>                                        </p>                    <hr />                    <p class=\"add-section\"><span class=\"plus\">+</span><a class=\"small action insert\" href=\"#\">insert section below</a></p>                </form>            </div>            <div class=\"with-upload\" style=\"display:none\">                <form class=\"upload-form\" name=\"form\" action=\"upload\" method=\"POST\" target=\"upload-frame\" enctype=\"multipart/form-data\" >                    <input type=\"file\" name=\"file\" /><br />                    <a href=\"#\" class=\"btn upload\">Upload</a> <a class=\"cancel small action\" href=\"#\">cancel</a>                    <iframe id=\"upload-frame\" name=\"upload-frame\" src=\"\" style=\"display:none;height:0;width:0\"></iframe>                </form>            </div>");
      editable.find('.with-url .upload').click(function() {
        editable.find('.with-url').hide();
        editable.find('.with-upload').show();
        return editable.find('.with-upload .upload').click(function() {
          var frame;
          frame = editable.find('#upload-frame');
          frame.unbind('load');
          frame.load(function() {
            var url;
            url = $(frame[0].contentWindow.document).text();
            editable.find('input.url').val(url);
            return _this.savePart(editable, fnUpdatePart, fnAfterSave);
          });
          return editable.find('.upload-form').submit();
        });
      });
      fnUpdatePart = function() {
        var src;
        src = editable.find('input.url').val();
        return part.value = src;
      };
      fnAfterSave = function() {
        return editable.html(_this.makeHtml("<p class=\"media\"><img src=\"" + part.value + "\" alt=\"\" /></p>"));
      };
      return editable.find('.save').click(function() {
        return _this.savePart(editable, fnUpdatePart, fnAfterSave);
      });
    };

    StoryEditView.prototype.editVideoPart = function(editable) {
      var fnAfterSave, fnUpdatePart, part, _ref,
        _this = this;
      part = editable.data('part');
      this.createForm(editable, "            <form>                YouTube url: <input type=\"text\" class=\"span5\" value=\"" + ((_ref = part.value) != null ? _ref : '') + "\" />                <p class=\"left\">                    <a class=\"save btn small\" href=\"#\">Save section</a> <a class=\"cancel small action\" href=\"#\">cancel</a>                    <a class=\"delete action small unsafe\" href=\"#\">delete?</a>                </p>                <hr />                <p class=\"add-section\"><span class=\"plus\">+</span><a class=\"small action insert\" href=\"#\">insert section below</a></p>            </form>");
      fnUpdatePart = function() {
        var url;
        url = editable.find('input').val();
        part.source = "youtube";
        return part.value = url;
      };
      fnAfterSave = function() {
        var embed, r, res, videoId;
        r = /https?:\/\/www\.youtube\.com\/watch\?v\=(\w+)/;
        res = part.value.match(r);
        if (res) {
          videoId = res[1];
          embed = "<p class=\"media\"><iframe width=\"480\" height=\"360\" src=\"https://www.youtube.com/embed/" + videoId + "\" frameborder=\"0\" allowfullscreen></iframe></p>";
          return editable.html(embed);
        }
      };
      return editable.find('.save').click(function() {
        return _this.savePart(editable, fnUpdatePart, fnAfterSave);
      });
    };

    StoryEditView.prototype.savePart = function(editable, fnUpdatePart, fnAfterSave) {
      var element, part, postData,
        _this = this;
      fnUpdatePart();
      part = editable.data('part');
      postData = {};
      if (part.isNew) {
        postData.previousParts = (function() {
          var _i, _len, _ref, _results;
          _ref = editable.prevAll();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            element = _ref[_i];
            if (!$(element).data('part').isNew) {
              _results.push($(element).data('part')._id);
            }
          }
          return _results;
        })();
        delete part.isNew;
        delete part._id;
      }
      postData.part = part;
      $.post("/stories/" + this.story._id + "/savePart", postData, function(response) {
        if (response.success) {
          if (response.partId) part._id = response.partId;
          editable.click(function() {
            return _this.editPart(editable);
          });
          editable.removeClass('selected');
          return fnAfterSave();
        }
      });
      return false;
    };

    StoryEditView.prototype.cancelPartEdit = function(editable) {
      var part;
      part = editable.data('part');
      if (!part.isNew) {
        editable.removeClass('selected');
        return this.renderPartContent(editable);
      } else {
        return editable.remove();
      }
    };

    StoryEditView.prototype.removePart = function(editable) {
      var part,
        _this = this;
      part = editable.data('part');
      if (!part.isNew) {
        return $.post("/stories/" + this.story._id + "/removePart", {
          part: part._id
        }, function(response) {
          console.log('ereddd');
          if (response.success) {
            console.log('ere');
            return editable.remove();
          }
        });
      } else {
        return editable.remove();
      }
    };

    StoryEditView.prototype.addSection = function(previous) {
      var addSection, added, content, elem,
        _this = this;
      elem = (function() {
        switch (previous) {
          case 'start':
            return $('#part-editor').children().first();
          case 'end':
            return $('#part-editor').children().last();
          default:
            return previous.next();
        }
      })();
      if (elem.hasClass('unsaved')) return;
      content = "            <li class=\"unsaved form\">                <select class=\"part-type span2\">                    <option value=\"HEADING\">Heading</option>                    <option value=\"TEXT\" selected=\"selected\">Text</option>                    <option value=\"IMAGE\">Image</option>                    <option value=\"VIDEO\">Video</option>                </select>                <p>                    <a href=\"#\" class=\"btn add\">Add</a>                    <a href=\"#\" class=\"small action cancel\">cancel</a>                </p>            </li>        ";
      if (previous === 'start') {
        $('#part-editor').prepend(content);
        added = $('#part-editor').children().first();
      } else if (previous === 'end') {
        $('#part-editor').append(content);
        added = $('#part-editor').children().last();
      } else {
        $(content).insertAfter(previous);
        added = previous.next();
      }
      added.find('select').focus();
      addSection = function() {
        var editable, part;
        part = {
          type: added.find('.part-type').val(),
          _id: SocialTypist.Utils.uniqueId(),
          isNew: true,
          value: ''
        };
        editable = _this.createPartContainer(part, added.prev());
        added.remove();
        editable.data('part', part);
        return _this.editPart(editable);
      };
      added.find('.add').click(function() {
        addSection();
        return false;
      });
      added.find('select').keypress(function(e) {
        if (e.which === 13) return addSection();
      });
      return added.find('.cancel').click(function() {
        added.remove();
        return false;
      });
    };

    StoryEditView.prototype.makeHtml = function(markdown) {
      if (markdown) {
        return this.showdown.makeHtml(markdown);
      } else {
        return '';
      }
    };

    StoryEditView.prototype.createForm = function(parent, html) {
      var _this = this;
      parent.html(html);
      return parent.children('form').last().submit(function() {
        return false;
      });
    };

    StoryEditView.prototype.getHeadingPrefix = function(size) {
      switch (size) {
        case 'H1':
          return '#';
        case 'H2':
          return '##';
        case 'H3':
          return '###';
        case 'H4':
          return '####';
        case 'H5':
          return '#####';
        case 'H6':
          return '######';
      }
    };

    return StoryEditView;

  })();

  this.SocialTypist.StoryEditView = StoryEditView;

}).call(this);

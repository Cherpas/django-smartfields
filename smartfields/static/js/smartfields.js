// Generated by CoffeeScript 1.4.0
(function() {
  var transitionEnd,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd ' + 'otransitionend MSTransitionEnd';

  window.smartfields = {
    isCsrfAjaxSetup: false,
    getFunction: function(func, parent) {
      var cur_obj, hierarchy, last, name, _i, _len;
      if (parent == null) {
        parent = window;
      }
      if (!(func != null)) {
        return null;
      } else if (typeof func === 'function') {
        return func;
      } else if (typeof func === 'string') {
        cur_obj = parent;
        hierarchy = func.split('.');
        last = hierarchy.length - 1;
        for (_i = 0, _len = hierarchy.length; _i < _len; _i++) {
          name = hierarchy[_i];
          if (!(cur_obj != null)) {
            return cur_obj;
          }
          cur_obj = cur_obj[name];
        }
        if (!typeof cur_obj === 'function') {
          throw TypeError("" + func + " is not a function");
        }
        return cur_obj;
      } else {
        throw TypeError("" + (typeof func) + " is incorrect. Has to be a string or function");
      }
    },
    isSafeMethod: function(method) {
      return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
    },
    getCookie: function(name) {
      var cookie, cookieValue, cookies, _i, _len;
      cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        cookies = document.cookie.split(';');
        for (_i = 0, _len = cookies.length; _i < _len; _i++) {
          cookie = cookies[_i];
          cookie = $.trim(cookie);
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    },
    getCsrfToken: function(field, csrfCookieName) {
      var csrftoken;
      csrftoken = field.val();
      if (!(csrftoken != null) && csrfCookieName) {
        csrftoken = this.getCookie(csrfCookieName);
      }
      return csrftoken;
    },
    csrfAjaxSetup: function(csrftoken) {
      if (!this.isCsrfAjaxSetup) {
        $.ajaxSetup({
          beforeSend: function(xhr, settings) {
            if (!smartfields.isSafeMethod(settings.type) && !this.crossDomain) {
              return xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
          }
        });
        return this.isCsrfAjaxSetup = true;
      }
    }
  };

  smartfields.FileField = (function() {

    function FileField($elem) {
      var csrftoken,
        _this = this;
      this.$elem = $elem;
      this.$form = this.$elem.closest('form');
      this.$browse_btn = this.$elem.find('.smartfields-btn-browse');
      csrftoken = smartfields.getCsrfToken(this.$form.find("input[name='csrfmiddlewaretoken']"), this.$browse_btn.data('csrfCookieName'));
      smartfields.csrfAjaxSetup(csrftoken);
      this.id = this.$browse_btn.attr('id');
      this.$delete_btn = $("#" + this.id + "_delete");
      this.deleting = false;
      this.$upload_btn = $("#" + this.id + "_upload");
      this.$progress = $("#" + this.id + "_progress").hide();
      this.$current = $("#" + this.id + "_current");
      this.$errors = $("#" + this.id + "_errors_extra");
      this.callbacks = {
        onError: smartfields.getFunction(this.$browse_btn.data('onError')),
        onComplete: smartfields.getFunction(this.$browse_btn.data('onComplete')),
        onReady: smartfields.getFunction(this.$browse_btn.data('onReady')),
        onBusy: smartfields.getFunction(this.$browse_btn.data('onBusy')),
        onProgress: smartfields.getFunction(this.$browse_btn.data('onProgress'))
      };
      this.$browse_btn.change(function() {
        var file_name;
        file_name = _this.$browse_btn.val().split('\\').pop();
        return _this.$current.val(file_name);
      });
      this.$current_btn = $("#" + this.id + "_link").click(function() {
        var href;
        href = $(this).data('href');
        if (href) {
          return window.open(href, $(this).data('target')).focus();
        }
      });
      this.$upload_btn.hide();
      if (!this.$current.val()) {
        this.$delete_btn.hide();
        this.$current_btn.parent().hide();
      }
      this.$delete_btn.click(function() {
        if (_this.deleting) {
          return false;
        }
        _this.deleting = true;
        return $.ajax(_this.options.url, {
          type: 'DELETE',
          success: function(data, textStatus, jqXHR) {
            var extra;
            if (data.state === 'complete') {
              _this.$current.val('');
              _this.$current_btn.data('href', "").hide();
              _this.$delete_btn.hide();
              _this.fileDeleted(data, textStatus, jqXHR);
            } else {
              extra = "";
              if (data.task_name) {
                extra = " , it is " + data.task_name;
              }
              bootbox.alert("Cannot delete this file right now" + extra + ". Please try again later.");
            }
            return _this.deleting = false;
          }
        });
      });
      this.options = {
        browse_button: this.id,
        container: this.$elem[0],
        file_data_name: this.$browse_btn.attr('name'),
        init: {
          Init: $.proxy(this.Init, this),
          PostInit: $.proxy(this.PostInit, this),
          OptionChanged: $.proxy(this.OptionChanged, this),
          Refresh: $.proxy(this.Refresh, this),
          StateChanged: $.proxy(this.StateChanged, this),
          UploadFile: $.proxy(this.UploadFile, this),
          BeforeUpload: $.proxy(this.BeforeUpload, this),
          QueueChanged: $.proxy(this.QueueChanged, this),
          UploadProgress: $.proxy(this.UploadProgress, this),
          FilesRemoved: $.proxy(this.FilesRemoved, this),
          FileFiltered: $.proxy(this.FileFiltered, this),
          FilesAdded: $.proxy(this.FilesAdded, this),
          FileUploaded: $.proxy(this.FileUploaded, this),
          ChunkUploaded: $.proxy(this.ChunkUploaded, this),
          UploadComplete: $.proxy(this.UploadComplete, this),
          Error: $.proxy(this.Error, this),
          Destroy: $.proxy(this.Destroy, this)
        }
      };
      if (csrftoken) {
        this.options.headers = {
          'X-CSRFToken': csrftoken
        };
      }
      $.extend(this.options, this.$browse_btn.data('pluploadOptions'));
      this.uploader = new plupload.Uploader(this.options);
      this.uploader.init();
      this.form_submitted = false;
      this.$form.submit(function() {
        if (!_this.form_submitted && _this.uploader.files.length > 0) {
          _this.form_submitted = true;
          _this.uploader.start();
          if (!_this.$browse_btn.data('silent')) {
            bootbox.alert("This form contains a file that can take some time to upload.                        Please, wait for it to finish, you should be able to see the progress                        under the file input. It will advance to the next step once it's done                        uploading");
          }
          return false;
        } else {
          return !_this.form_submitted;
        }
      });
    }

    FileField.prototype.setProgress = function(index, percent, task_name) {
      var bar, len, _i, _len, _ref, _results;
      if (!(index != null) && !(percent != null) && !(task_name != null)) {
        _ref = this.$progress.children();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          bar = _ref[_i];
          _results.push($(bar).attr('aria-valuenow', 0).width("0%").find('span').html("Ready"));
        }
        return _results;
      } else {
        len = this.$progress.children().length;
        if (index > 0) {
          bar = this.$progress.children()[len - index];
          $(bar).attr('aria-valuenow', 100 - percent).width("" + (100 - percent) + "%");
        }
        bar = this.$progress.children()[len - 1 - index];
        $(bar).attr('aria-valuenow', percent).width("" + percent + "%").find('span').html("" + percent + "% " + task_name);
        return this.$current.val("" + task_name + "... " + percent + "%");
      }
    };

    FileField.prototype.handleResponse = function(data, complete, error) {
      var completed, delayedComplete, progress, _base, _base1, _base2,
        _this = this;
      if (data.state === 'complete') {
        completed = false;
        delayedComplete = function() {
          var _base;
          if (!completed) {
            completed = true;
            _this.$progress.hide();
            _this.setProgress();
            _this.$delete_btn.show();
            _this.$current.val(data.file_name);
            _this.$current_btn.data('href', data.file_url).parent().show();
            if (typeof complete === "function") {
              complete(data);
            }
            if (typeof (_base = _this.callbacks).onComplete === "function") {
              _base.onComplete(_this, data);
            }
            if (_this.form_submitted && data.state !== 'error') {
              _this.form_submitted = false;
              return _this.$form.submit();
            }
          }
        };
        this.setProgress(1, 100, data.task_name);
        this.$progress.one(transitionEnd, function() {
          return delayedComplete;
        });
        return setTimeout(delayedComplete, 1500);
      } else if (data.state === 'error') {
        this.setErrors(data.messages);
        if (typeof error === "function") {
          error(data);
        }
        return typeof (_base = this.callbacks).onError === "function" ? _base.onError(this, data) : void 0;
      } else if (data.state !== 'ready') {
        if (data.state === 'in_progress') {
          progress = Math.round(100 * data.progress);
          this.setProgress(1, progress, data.task_name);
          if (typeof (_base1 = this.callbacks).onProgress === "function") {
            _base1.onProgress(this, data, progress);
          }
          if (this.form_submitted) {
            this.form_submitted = false;
            this.$form.submit();
          }
        }
        return setTimeout((function() {
          return $.get(_this.options.url, function(data) {
            return _this.handleResponse(data);
          });
        }), 3000);
      } else if (data.state === 'ready') {
        return typeof (_base2 = this.callbacks).onReady === "function" ? _base2.onReady(this, data) : void 0;
      }
    };

    FileField.prototype.fileDeleted = function(data, textStatus, jqXHR) {};

    FileField.prototype.setErrors = function(errors) {
      var e, i, _i, _len, _results;
      this.$errors.empty();
      if (errors) {
        this.$progress.hide();
        this.setProgress();
        this.$elem.addClass('has-error');
        this.$current.val("ERROR");
        _results = [];
        for (i = _i = 0, _len = errors.length; _i < _len; i = ++_i) {
          e = errors[i];
          _results.push(this.$errors.append($("<li>", {
            'id': "error_" + i + "_" + this.id,
            'class': "bg-danger"
          }).html($("<strong>").text(e))));
        }
        return _results;
      } else {
        return this.$elem.removeClass('has-error');
      }
    };

    FileField.prototype.Init = function() {};

    FileField.prototype.OptionChanged = function() {};

    FileField.prototype.Refresh = function() {};

    FileField.prototype.StateChanged = function() {};

    FileField.prototype.UploadFile = function() {};

    FileField.prototype.QueueChanged = function() {};

    FileField.prototype.FilesRemoved = function(up, file) {};

    FileField.prototype.FileFiltered = function(up, file) {};

    FileField.prototype.ChunkUploaded = function() {};

    FileField.prototype.UploadComplete = function() {};

    FileField.prototype.Error = function(up, error) {
      var maxSize, maxSizeMessage, size, _ref;
      switch (error.code) {
        case plupload.FILE_EXTENSION_ERROR:
          this.setErrors(["Unsupported file type: " + error.file.name]);
          return up.splice(0, up.files.length);
        case plupload.FILE_SIZE_ERROR:
          size = plupload.formatSize(error.file.size);
          maxSize = (_ref = this.options.filters) != null ? _ref.max_file_size : void 0;
          maxSizeMessage = "";
          if (maxSize) {
            maxSize = plupload.parseSize(maxSize);
            maxSize = plupload.formatSize(maxSize);
            maxSizeMessage = " Maximum size is: " + maxSize;
          }
          this.setErrors(["File is too big: " + size + "." + maxSizeMessage]);
          return up.splice(0, up.files.length);
        default:
          return this.setErrors([error.message]);
      }
    };

    FileField.prototype.Destroy = function() {};

    FileField.prototype.PostInit = function(up) {
      var status;
      this.$browse_btn.click(function() {
        return false;
      }).replaceWith(this.$elem.find(".moxie-shim").hide().find('input'));
      this.$upload_btn.click(function() {
        up.start();
        return false;
      });
      status = this.$browse_btn.data('status');
      if ((status != null ? status.state : void 0) === 'in_progress') {
        this.$progress.show();
      }
      return this.handleResponse(status);
    };

    FileField.prototype.FilesAdded = function(up, files) {
      this.$current.val(files[0].name);
      this.$upload_btn.show();
      this.$progress.show();
      this.$delete_btn.hide();
      up.splice(0, up.files.length - 1);
      return this.setErrors();
    };

    FileField.prototype.BeforeUpload = function() {
      this.setProgress();
      return this.$upload_btn.hide();
    };

    FileField.prototype.UploadProgress = function(up, file) {
      return this.setProgress(0, file.percent, "Uploading");
    };

    FileField.prototype.FileUploaded = function(up, file, data) {
      var response;
      up.removeFile(file);
      if (data.status === 200) {
        response = $.parseJSON(data.response);
        return this.handleResponse(response);
      } else if (data.status === 409) {
        return response = $.parseJSON(data.response);
      }
    };

    return FileField;

  })();

  smartfields.MediaField = (function(_super) {

    __extends(MediaField, _super);

    function MediaField($elem) {
      MediaField.__super__.constructor.call(this, $elem);
      this.$current_preview = $("#" + this.id + "_preview");
    }

    MediaField.prototype.fileDeleted = function(data, textStatus, jqXHR) {
      return this.$current_preview.empty();
    };

    MediaField.prototype.handleResponse = function(data, complete, error) {
      var _this = this;
      return MediaField.__super__.handleResponse.call(this, data, (function(data) {
        var $preview, persistentLoader;
        $preview = _this.$current_preview.empty().html(data.html_tag);
        persistentLoader = function(attempts) {
          return _this.$current_preview.find("[src]").each(function() {
            return $(this).load(function() {}).error(function() {
              if (attempts > 0) {
                return setTimeout((function() {
                  $preview.empty().html(data.html_tag);
                  return persistentLoader(attempts - 1);
                }), 1000);
              }
            });
          });
        };
        persistentLoader(5);
        return typeof complete === "function" ? complete() : void 0;
      }), error);
    };

    MediaField.prototype.BeforeUpload = function() {
      this.$current_preview.empty();
      return MediaField.__super__.BeforeUpload.apply(this, arguments);
    };

    return MediaField;

  })(smartfields.FileField);

  smartfields.LimitedField = (function() {

    function LimitedField($elem) {
      var $feedback, $field, maxlength;
      this.$elem = $elem;
      $field = this.$elem.find(".smartfield");
      $feedback = this.$elem.find(".feedback-counter");
      maxlength = parseInt($field.attr("maxlength") || $field.data("maxlength"));
      if (!isNaN(maxlength)) {
        $field.keyup(function() {
          var content, current_length, newlines;
          content = $field.val();
          newlines = content.split('\n').length - 1;
          current_length = content.length + newlines;
          if (current_length >= maxlength) {
            content = content.substr(0, maxlength - newlines);
            $field.val(content);
            newlines = content.split('\n').length - 1;
            current_length = content.length + newlines;
          }
          $feedback.text(maxlength - current_length);
          return true;
        }).trigger('keyup');
      }
    }

    return LimitedField;

  })();

  $(document).ready(function() {
    $(".smartfields-filefield").each(function() {
      if (!($(this).data('smartfield') != null)) {
        $(this).data('smartfield', new smartfields.FileField($(this)));
      }
      return null;
    });
    $(".smartfields-mediafield").each(function() {
      if (!($(this).data('smartfield') != null)) {
        $(this).data('smartfield', new smartfields.MediaField($(this)));
      }
      return null;
    });
    $(".smartfields-limitedfield").each(function() {
      if (!($(this).data('smartfield') != null)) {
        $(this).data('smartfield', new smartfields.LimitedField($(this)));
      }
      return null;
    });
    return null;
  });

}).call(this);

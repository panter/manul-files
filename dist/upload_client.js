'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _init_upload_directives = require('./init_upload_directives');

var _init_upload_directives2 = _interopRequireDefault(_init_upload_directives);

var _resize = require('./resize');

var _resize2 = _interopRequireDefault(_resize);

var RESIZABLE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

var UploadClientService = (function () {
  function UploadClientService(_ref) {
    var Slingshot = _ref.Slingshot;
    var Directives = _ref.Directives;
    var options = arguments.length <= 1 || arguments[1] === undefined ? {
      resizeQuality: 0.6,
      onAfterUpload: _lodash2['default'].noop
    } : arguments[1];

    _classCallCheck(this, UploadClientService);

    this.Slingshot = Slingshot;
    this.Directives = Directives;
    this.options = options;
    (0, _init_upload_directives2['default'])({ Slingshot: Slingshot, Directives: Directives });
  }

  _createClass(UploadClientService, [{
    key: 'shouldResize',
    value: function shouldResize(directiveName, _ref2) {
      var size = _ref2.size;
      var type = _ref2.type;
      var fileRestrictions = this.Directives[directiveName].fileRestrictions;

      if (!fileRestrictions.maxSize || fileRestrictions.maxSize >= size) {
        return false;
      }
      if (_lodash2['default'].includes(RESIZABLE_MIME_TYPES, type)) {
        return true;
      }
      return false;
    }
  }, {
    key: 'getResizeOptions',
    value: function getResizeOptions(directiveName) {
      var fileRestrictions = this.Directives[directiveName].fileRestrictions;

      return {
        maxDimension: fileRestrictions.resizeToMaxDimension,
        quality: this.options.resizeQuality
      };
    }
  }, {
    key: 'createUploader',
    value: function createUploader(directiveName, metaContext) {
      var _this = this;

      var uploader = new this.Slingshot.Upload(directiveName, metaContext);

      // can't extend properly with classes :-(
      var superSend = uploader.send;
      var upload = function upload(file, callback) {
        var callbackWithTracking = function callbackWithTracking(error, url) {
          if (_lodash2['default'].isFunction(_this.options.onAfterUpload)) {
            _this.options.onAfterUpload(error, { url: url, file: file, directiveName: directiveName });
          }
          callback(error, url);
        };

        superSend(file, callbackWithTracking);
      };

      uploader.send = function (file, callback) {
        // resize if too large
        if (_this.shouldResize(directiveName, file)) {
          var resizeOptions = _this.getResizeOptions(directiveName);
          (0, _resize2['default'])(file, resizeOptions, function (error, fileResized) {
            if (!error) {
              upload(fileResized, callback);
            } else {
              callback(error);
            }
          });
        } else {
          upload(file, callback);
        }
      };
      return uploader;
    }
  }]);

  return UploadClientService;
})();

exports['default'] = UploadClientService;
module.exports = exports['default'];
//# sourceMappingURL=upload_client.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _includes2 = require('lodash/includes');

var _includes3 = _interopRequireDefault(_includes2);

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _init_upload_directives = require('./init_upload_directives');

var _init_upload_directives2 = _interopRequireDefault(_init_upload_directives);

var _resize = require('./resize');

var _resize2 = _interopRequireDefault(_resize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RESIZABLE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

var UploadClientService = function () {
  function UploadClientService(_ref) {
    var Slingshot = _ref.Slingshot,
        Directives = _ref.Directives;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      resizeQuality: 0.6,
      onAfterUpload: _noop3.default
    };

    _classCallCheck(this, UploadClientService);

    this.Slingshot = Slingshot;
    this.Directives = Directives;
    this.options = options;
    (0, _init_upload_directives2.default)({ Slingshot: Slingshot, Directives: Directives });
  }

  _createClass(UploadClientService, [{
    key: 'shouldResize',
    value: function shouldResize(directiveName, _ref2) {
      var size = _ref2.size,
          type = _ref2.type;
      var fileRestrictions = this.Directives[directiveName].fileRestrictions;

      if (!fileRestrictions.maxSize || fileRestrictions.maxSize >= size) {
        return false;
      }
      if ((0, _includes3.default)(RESIZABLE_MIME_TYPES, type)) {
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
          if ((0, _isFunction3.default)(_this.options.onAfterUpload)) {
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
          (0, _resize2.default)(file, resizeOptions, function (error, fileResized) {
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
}();

exports.default = UploadClientService;
//# sourceMappingURL=upload_client.js.map
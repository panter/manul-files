'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeWithUploader = exports.composer = exports.depsMapper = undefined;

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _isNaN2 = require('lodash/isNaN');

var _isNaN3 = _interopRequireDefault(_isNaN2);

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mantraCore = require('mantra-core');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var depsMapper = exports.depsMapper = function depsMapper(_context) {
  return {
    context: function context() {
      return _context;
    }
  };
};

var composer = exports.composer = function composer(_ref, onData) {
  var context = _ref.context,
      uploader = _ref.uploader,
      _ref$alertsNamespace = _ref.alertsNamespace,
      alertsNamespace = _ref$alertsNamespace === undefined ? 'upload' : _ref$alertsNamespace,
      _ref$onUploadError = _ref.onUploadError,
      onUploadError = _ref$onUploadError === undefined ? _noop3.default : _ref$onUploadError,
      _ref$onUploadSuccess = _ref.onUploadSuccess,
      onUploadSuccess = _ref$onUploadSuccess === undefined ? _noop3.default : _ref$onUploadSuccess;

  var _context2 = context(),
      Alerts = _context2.Alerts;

  var getUploadCallback = function getUploadCallback(file, callback) {
    // check if Alerts has support for handleCallback
    if (Alerts && Alerts.handleCallback) {
      return Alerts.handleCallback(alertsNamespace, {
        props: function props() {
          return { file: file };
        }
      }, callback);
    }
    // legacy
    return function (error, url) {
      if (error) {
        onUploadError(error);
      } else {
        onUploadSuccess({ file: file, url: url });
      }
      callback(error, url);
    };
  };
  var upload = function upload(file, callback) {
    uploader.send(file, getUploadCallback(file, callback));
  };
  var progressDecimal = !(0, _isNaN3.default)(uploader.progress()) ? uploader.progress() : 0;
  var progress = Math.round(progressDecimal * 100);
  var status = uploader.status();
  // we use showFileError in FileField to indicate files that were already rejected by the dropzone
  onData(null, { upload: upload, progress: progress, status: status });
};

var composeWithUploader = exports.composeWithUploader = function composeWithUploader() {
  return function (C) {
    var WithUploader = function (_React$Component) {
      _inherits(WithUploader, _React$Component);

      function WithUploader(props) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            uniforms = _ref2.uniforms;

        _classCallCheck(this, WithUploader);

        var _this = _possibleConstructorReturn(this, (WithUploader.__proto__ || Object.getPrototypeOf(WithUploader)).call(this, props));

        var _props$context = props.context(),
            uploadService = _props$context.uploadService;

        if (!uploadService) {
          throw new Error('Please provide uploadService in your context');
        }
        _this.directive = uploadService.Directives[props.directiveName];
        // metaContext is available on the server when creating a key
        // it can be a function and will be called with props and the uniforms' context
        // if embedded on a fileField
        // see collections/companies for an example
        var metaContext = (0, _isFunction3.default)(props.metaContext) ? props.metaContext(props, uniforms) : props.metaContext;

        _this.uploader = uploadService.createUploader(props.directiveName, metaContext);
        return _this;
      }

      _createClass(WithUploader, [{
        key: 'render',
        value: function render() {
          var props = this.props;

          var CWithTracker = (0, _mantraCore.composeWithTracker)(composer)(C);
          var fileRestrictions = this.directive.fileRestrictions;

          return _react2.default.createElement(CWithTracker, _extends({}, props, {
            fileRestrictions: fileRestrictions,
            uploader: this.uploader
          }));
        }
      }]);

      return WithUploader;
    }(_react2.default.Component);
    WithUploader.contextTypes = {
      uniforms: _react2.default.PropTypes.object
    };

    WithUploader.displayName = 'withUploader(' + C.displayName + ')';

    return WithUploader;
  };
};

exports.default = function (C) {
  return (0, _mantraCore.composeAll)(composeWithUploader(), (0, _mantraCore.useDeps)(depsMapper))(C);
};
//# sourceMappingURL=with_uploader.js.map
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeWithUploader = exports.composer = exports.depsMapper = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _isNaN2 = require('lodash/isNaN');

var _isNaN3 = _interopRequireDefault(_isNaN2);

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _mantraCore = require('mantra-core');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      (0, _inherits3.default)(WithUploader, _React$Component);

      function WithUploader(props) {
        var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            uniforms = _ref2.uniforms;

        (0, _classCallCheck3.default)(this, WithUploader);

        var _this = (0, _possibleConstructorReturn3.default)(this, (WithUploader.__proto__ || (0, _getPrototypeOf2.default)(WithUploader)).call(this, props));

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

      (0, _createClass3.default)(WithUploader, [{
        key: 'render',
        value: function render() {
          var props = this.props;

          var CWithTracker = (0, _mantraCore.composeWithTracker)(composer)(C);
          var fileRestrictions = this.directive.fileRestrictions;

          return _react2.default.createElement(CWithTracker, (0, _extends3.default)({}, props, {
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
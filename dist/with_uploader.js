'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _mantraCore = require('mantra-core');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var depsMapper = function depsMapper(_context) {
  return {
    context: function context() {
      return _context;
    }
  };
};

exports.depsMapper = depsMapper;
var composer = function composer(_ref, onData) {
  var context = _ref.context;
  var uploader = _ref.uploader;
  var _ref$alertsNamespace = _ref.alertsNamespace;
  var alertsNamespace = _ref$alertsNamespace === undefined ? 'upload' : _ref$alertsNamespace;
  var _ref$onUploadError = _ref.onUploadError;
  var onUploadError = _ref$onUploadError === undefined ? _lodash2['default'].noop : _ref$onUploadError;
  var _ref$onUploadSuccess = _ref.onUploadSuccess;
  var onUploadSuccess = _ref$onUploadSuccess === undefined ? _lodash2['default'].noop : _ref$onUploadSuccess;

  var _context2 = context();

  var Alerts = _context2.Alerts;

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
  var progress = Math.round(uploader.progress() * 100);
  var status = uploader.status();
  // we use showFileError in FileField to indicate files that were already rejected by the dropzone
  onData(null, { upload: upload, progress: progress, status: status });
};

exports.composer = composer;
var composeWithUploader = function composeWithUploader() {
  return function (C) {
    var WithUploader = (function (_React$Component) {
      _inherits(WithUploader, _React$Component);

      function WithUploader(props) {
        var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var uniforms = _ref2.uniforms;

        _classCallCheck(this, WithUploader);

        _get(Object.getPrototypeOf(WithUploader.prototype), 'constructor', this).call(this, props);

        var _props$context = props.context();

        var uploadService = _props$context.uploadService;

        if (!uploadService) {
          throw new Error('Please provide uploadService in your context');
        }
        this.directive = uploadService.Directives[props.directiveName];
        // metaContext is available on the server when creating a key
        // it can be a function and will be called with props and the uniforms' context
        // if embedded on a fileField
        // see collections/companies for an example
        var metaContext = _lodash2['default'].isFunction(props.metaContext) ? props.metaContext(props, uniforms) : props.metaContext;

        this.uploader = uploadService.createUploader(props.directiveName, metaContext);
      }

      _createClass(WithUploader, [{
        key: 'render',
        value: function render() {
          var props = this.props;

          var CWithTracker = (0, _mantraCore.composeWithTracker)(composer)(C);
          var fileRestrictions = this.directive.fileRestrictions;

          return _react2['default'].createElement(CWithTracker, _extends({}, props, {
            fileRestrictions: fileRestrictions,
            uploader: this.uploader
          }));
        }
      }]);

      return WithUploader;
    })(_react2['default'].Component);
    WithUploader.contextTypes = {
      uniforms: _react2['default'].PropTypes.object
    };

    WithUploader.displayName = 'withUploader(' + C.displayName + ')';

    return WithUploader;
  };
};

exports.composeWithUploader = composeWithUploader;

exports['default'] = function (C) {
  return (0, _mantraCore.composeAll)(composeWithUploader(), (0, _mantraCore.useDeps)(depsMapper))(C);
};
//# sourceMappingURL=with_uploader.js.map
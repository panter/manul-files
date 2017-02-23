'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

exports['default'] = function (_ref) {
  var Slingshot = _ref.Slingshot;
  var Directives = _ref.Directives;

  _lodash2['default'].keys(Directives).forEach(function (name) {
    var directive = Directives[name];
    Slingshot.fileRestrictions(name, _lodash2['default'].pick(directive.fileRestrictions, ['maxSize', 'allowedFileTypes', 'authorize']));
  });
};

module.exports = exports['default'];
//# sourceMappingURL=init_upload_directives.js.map
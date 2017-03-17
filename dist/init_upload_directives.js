'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _keys2 = require('lodash/keys');

var _keys3 = _interopRequireDefault(_keys2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var Slingshot = _ref.Slingshot,
      Directives = _ref.Directives;

  (0, _keys3.default)(Directives).forEach(function (name) {
    var directive = Directives[name];
    Slingshot.fileRestrictions(name, (0, _pick3.default)(directive.fileRestrictions, ['maxSize', 'allowedFileTypes', 'authorize']));
  });
};
//# sourceMappingURL=init_upload_directives.js.map
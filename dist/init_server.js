'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys2 = require('lodash/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _init_upload_directives = require('./init_upload_directives');

var _init_upload_directives2 = _interopRequireDefault(_init_upload_directives);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var Slingshot = _ref.Slingshot,
      Directives = _ref.Directives,
      _ref$bucket = _ref.bucket,
      bucket = _ref$bucket === undefined ? 'aws-bucket' : _ref$bucket,
      _ref$acl = _ref.acl,
      acl = _ref$acl === undefined ? 'public-read' : _ref$acl,
      _ref$region = _ref.region,
      region = _ref$region === undefined ? 'eu-central-1' : _ref$region,
      _ref$AWSAccessKeyId = _ref.AWSAccessKeyId,
      AWSAccessKeyId = _ref$AWSAccessKeyId === undefined ? process.env.AWS_ACCESS_KEY_ID || '' : _ref$AWSAccessKeyId,
      _ref$AWSSecretAccessK = _ref.AWSSecretAccessKey,
      AWSSecretAccessKey = _ref$AWSSecretAccessK === undefined ? process.env.AWS_SECRET_ACCESS_KEY || '' : _ref$AWSSecretAccessK;

  (0, _init_upload_directives2.default)({ Slingshot: Slingshot, Directives: Directives });
  // init server Directives

  (0, _keys3.default)(Directives).forEach(function (name) {
    var server = Directives[name].server;

    Slingshot.createDirective(name, Slingshot.S3Storage, (0, _extends3.default)({
      bucket: bucket,
      acl: acl,
      region: region,
      AWSAccessKeyId: AWSAccessKeyId,
      AWSSecretAccessKey: AWSSecretAccessKey
    }, server));
  });
};
//# sourceMappingURL=init_server.js.map
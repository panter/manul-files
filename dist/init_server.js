'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _init_upload_directives = require('./init_upload_directives');

var _init_upload_directives2 = _interopRequireDefault(_init_upload_directives);

exports['default'] = function (_ref) {
  var Slingshot = _ref.Slingshot;
  var Directives = _ref.Directives;
  var _ref$bucket = _ref.bucket;
  var bucket = _ref$bucket === undefined ? 'aws-bucket' : _ref$bucket;
  var _ref$acl = _ref.acl;
  var acl = _ref$acl === undefined ? 'public-read' : _ref$acl;
  var _ref$region = _ref.region;
  var region = _ref$region === undefined ? 'eu-central-1' : _ref$region;
  var _ref$AWSAccessKeyId = _ref.AWSAccessKeyId;
  var AWSAccessKeyId = _ref$AWSAccessKeyId === undefined ? process.env.AWS_ACCESS_KEY_ID || '' : _ref$AWSAccessKeyId;
  var _ref$AWSSecretAccessKey = _ref.AWSSecretAccessKey;
  var AWSSecretAccessKey = _ref$AWSSecretAccessKey === undefined ? process.env.AWS_SECRET_ACCESS_KEY || '' : _ref$AWSSecretAccessKey;

  (0, _init_upload_directives2['default'])({ Slingshot: Slingshot, Directives: Directives });
  // init server Directives

  _lodash2['default'].keys(Directives).forEach(function (name) {
    var server = Directives[name].server;

    Slingshot.createDirective(name, Slingshot.S3Storage, _extends({
      bucket: bucket,
      acl: acl,
      region: region,
      AWSAccessKeyId: AWSAccessKeyId,
      AWSSecretAccessKey: AWSSecretAccessKey
    }, server));
  });
};

module.exports = exports['default'];
//# sourceMappingURL=init_server.js.map
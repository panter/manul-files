'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get_orientation = require('./get_orientation');

var _get_orientation2 = _interopRequireDefault(_get_orientation);

var _rotate = require('./rotate');

var _rotate2 = _interopRequireDefault(_rotate);

try {
  require('blueimp-canvas-to-blob'); // polyfill
} catch (e) {
  //
}

exports['default'] = function (file, _x, onResult) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref$maxDimension = _ref.maxDimension;
  var maxDimension = _ref$maxDimension === undefined ? 640 : _ref$maxDimension;
  var _ref$quality = _ref.quality;
  var quality = _ref$quality === undefined ? 0.6 : _ref$quality;

  // get orientation first

  (0, _get_orientation2['default'])(file, function (orientation) {
    // thx http://stackoverflow.com/questions/23945494/use-html5-to-resize-an-image-before-upload
    // Load the image
    var reader = new global.FileReader();
    reader.onload = function (readerEvent) {
      var image = new global.Image();
      image.onload = function () {
        // Resize the image
        var canvas = global.document.createElement('canvas');
        var width = image.width;
        var height = image.height;

        if (width > height) {
          if (width > maxDimension) {
            height *= maxDimension / width;
            width = maxDimension;
          }
        } else if (height > maxDimension) {
          width *= maxDimension / height;
          height = maxDimension;
        }
        canvas.width = width;
        canvas.height = height;
        (0, _rotate2['default'])(canvas, width, height, orientation);
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);

        canvas.toBlob(function (blob) {
          onResult(null, blob);
        }, 'image/jpeg', quality);
      };
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
};

module.exports = exports['default'];
//# sourceMappingURL=resize.js.map


import getOrientation from './get_orientation';
import rotate from './rotate';

require('blueimp-canvas-to-blob'); // polyfill

export default (file, { maxDimension = 640, quality = 0.6 } = {}, onResult) => {
  // get orientation first

  getOrientation(file, (orientation) => {
    // thx http://stackoverflow.com/questions/23945494/use-html5-to-resize-an-image-before-upload
    // Load the image
    const reader = new global.FileReader();
    reader.onload = (readerEvent) => {
      const image = new global.Image();
      image.onload = () => {
                  // Resize the image
        const canvas = global.document.createElement('canvas');
        let width = image.width;
        let height = image.height;

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
        rotate(canvas, width, height, orientation);
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);

        canvas.toBlob((blob) => {
          onResult(null, blob);
        }, 'image/jpeg', quality);
      };
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
};

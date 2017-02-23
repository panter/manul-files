import initUploadDirectives from './init_upload_directives';
import _ from 'lodash';
import resize from './resize';

const RESIZABLE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export default class UploadClientService {

  constructor({ Slingshot, Directives }, options = {
    resizeQuality: 0.6,
    onAfterUpload: _.noop,
  }) {
    this.Slingshot = Slingshot;
    this.Directives = Directives;
    this.options = options;
    initUploadDirectives({ Slingshot, Directives });
  }

  shouldResize(directiveName, { size, type }) {
    const { fileRestrictions } = this.Directives[directiveName];
    if (!fileRestrictions.maxSize || fileRestrictions.maxSize >= size) {
      return false;
    }
    if (_.includes(RESIZABLE_MIME_TYPES, type)) {
      return true;
    }
    return false;
  }

  getResizeOptions(directiveName) {
    const { fileRestrictions } = this.Directives[directiveName];
    return {
      maxDimension: fileRestrictions.resizeToMaxDimension,
      quality: this.options.resizeQuality,
    };
  }

  createUploader(directiveName, metaContext) {
    const uploader = new this.Slingshot.Upload(directiveName, metaContext);

    // can't extend properly with classes :-(
    const superSend = uploader.send;
    const upload = (file, callback) => {
      const callbackWithTracking = (error, url) => {
        if (_.isFunction(this.options.onAfterUpload)) {
          this.options.onAfterUpload(error, { url, file, directiveName });
        }
        callback(error, url);
      };

      superSend(file, callbackWithTracking);
    };

    uploader.send = (file, callback) => {
      // resize if too large
      if (this.shouldResize(directiveName, file)) {
        const resizeOptions = this.getResizeOptions(directiveName);
        resize(file, resizeOptions, (error, fileResized) => {
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
}

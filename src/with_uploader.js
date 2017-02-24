import { useDeps, composeAll, composeWithTracker } from 'mantra-core';
import React from 'react';
import _ from 'lodash';

export const depsMapper = context => ({
  context: () => context,
});

export const composer = (
  { context, uploader, alertsNamespace = 'upload', onUploadError = _.noop, onUploadSuccess = _.noop }
  , onData) => {
  const { Alerts } = context();
  const getUploadCallback = (file, callback) => {
    // check if Alerts has support for handleCallback
    if (Alerts && Alerts.handleCallback) {
      return Alerts.handleCallback(alertsNamespace, {
        props: () => ({ file }),
      },
        callback,
      );
    }
    // legacy
    return (error, url) => {
      if (error) {
        onUploadError(error);
      } else {
        onUploadSuccess({ file, url });
      }
      callback(error, url);
    };
  };
  const upload = (file, callback) => {
    uploader.send(file, getUploadCallback(file, callback));
  };
  const progress = Math.round(uploader.progress() * 100);
  const status = uploader.status();
  // we use showFileError in FileField to indicate files that were already rejected by the dropzone
  onData(null, { upload, progress, status });
};

export const composeWithUploader = () => (C) => {
  const WithUploader = class extends React.Component {
    constructor(props, { uniforms } = {}) {
      super(props);

      const { uploadService } = props.context();
      if (!uploadService) {
        throw new Error('Please provide uploadService in your context');
      }
      this.directive = uploadService.Directives[props.directiveName];
      // metaContext is available on the server when creating a key
      // it can be a function and will be called with props and the uniforms' context
      // if embedded on a fileField
      // see collections/companies for an example
      const metaContext = _.isFunction(props.metaContext) ?
        props.metaContext(props, uniforms) :
        props.metaContext;

      this.uploader = uploadService.createUploader(props.directiveName, metaContext);
    }
    render() {
      const props = this.props;

      const CWithTracker = composeWithTracker(composer)(C);
      const fileRestrictions = this.directive.fileRestrictions;

      return (
        <CWithTracker
          {...props}
          fileRestrictions={fileRestrictions}
          uploader={this.uploader}
        />
      );
    }
  };
  WithUploader.contextTypes = {
    uniforms: React.PropTypes.object,
  };

  WithUploader.displayName = `withUploader(${C.displayName})`;

  return WithUploader;
};


export default C => composeAll(
  composeWithUploader(),
  useDeps(depsMapper),
)(C);

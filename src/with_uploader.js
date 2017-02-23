import { useDeps, composeAll, composeWithTracker, compose } from 'mantra-core';
import React from 'react';
import _ from 'lodash';

export const depsMapper = (context, actions) => ({
  context: () => context,
});


export const composer = ({ context, uploader }, onData) => {
  const { Alerts } = context();
  const showFileError = (message, error) => Alerts.show({ type: 'error', message, error });
  const upload = (file, callback) => {
    uploader.send(file, (error, url) => {
      if (error) {
        showFileError('upload.errors.couldNotUpload', error);
      } else {
        Alerts.show({ message: 'upload.success' });
      }
      callback(error, url);
    });
  };
  const progress = Math.round(uploader.progress() * 100);
  const status = uploader.status();
  // we use showFileError in FileField to indicate files that were already rejected by the dropzone
  onData(null, { showFileError, upload, progress, status });
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

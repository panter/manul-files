import _ from 'lodash';

export default ({ Slingshot, Directives }) => {
  _.keys(Directives).forEach((name) => {
    const directive = Directives[name];
    Slingshot.fileRestrictions(name, _.pick(directive.fileRestrictions, ['maxSize', 'allowedFileTypes', 'authorize']));
  });
};

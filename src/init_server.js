import initUploadDirectives from './init_upload_directives';
import _ from 'lodash';

export default ({ Slingshot, Directives,
  bucket = 'aws-bucket',
  acl = 'public-read',
  region = 'eu-central-1',
  AWSAccessKeyId = process.env.AWS_ACCESS_KEY_ID || '',
  AWSSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '',
}) => {
  initUploadDirectives({ Slingshot, Directives });
  // init server Directives

  _.keys(Directives).forEach((name) => {
    const { server } = Directives[name];
    Slingshot.createDirective(name, Slingshot.S3Storage, {
      bucket,
      acl,
      region,
      AWSAccessKeyId,
      AWSSecretAccessKey,
      ...server,
    });
  });
};

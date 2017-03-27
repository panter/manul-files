# manul-files


This package provides services and HOCs for file uploads using Slingshot in mantra-apps.
It's currently only working for amazon-s3.

## Usage

### configure directives

In a common-directory (client & server) you can place directives. 
Each one has a name (here `userProfileImages`):

```

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

// see also server/slingshot
// authorize and key are run on the server
export default {
  userProfileImages: {
    fileRestrictions: {
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
      maxSizeClient: 10 * 1024 * 1024, // we resize
      resizeToMaxDimension: 720, // width or height in pixels
      maxSize: 200 * 1024, // on server, this is also limit where compression starts
    },
    server: {
      authorize() {
        // for logged in users
        if (
        !this.userId
        ) {
          const message = 'Not authorized';
          throw new Meteor.Error('not allowed', message);
        }

        return true;
      },
      key(file) {
        if (!this.userId) {
          throw new Meteor.Error('only allowed when user already exists');
        }
        const randomId = Random.id();
        const extension = require('/server/get_file_extension').default(file);

        return `user_profile_images/${this.userId}/${randomId}.${extension}`;
      },
    },
  },
};
```

### init server

on server, call this on startup:

```
import { initServer } from '@panter/manul-files';

import Directives from '/lib/slingshot_directives';


Meteor.startup(() => {
  initServer({ Slingshot, Directives, bucket: 'your-amazon-bucket' });
})
```

### client

In your context.js, instantiate a new upload instance and add it to the context:

```

import Directives from '/lib/slingshot_directives';

// ...
const context = {
  // ...
  uploadService: new UploadClient({ Slingshot, Directives })
};
```

You can now use this hoc to compose a file field:

```

import { withUploader } from '@panter/manul-files';

const FileField = withUploader(({
  fileRestrictions,
  upload, // upload function: upload(file, callback)
  progress, // progress in percent
  value, 
  onChange
}) => (
  <input type="file" onChange={file => upload(file, (error, url) => {
    if(error) {
      console.log(error);
    else {
      onChange(url)
    }
  }} />
))

```

You have now a FileField which can receive a `directiveName` like this:

```
<FileField directiveName="userProfileImages" value={...} onChange={...} />
```


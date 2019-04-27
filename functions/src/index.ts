const functions = require('firebase-functions');

import { Storage } from '@google-cloud/storage';
const gcs = new Storage();

const os = require('os');
const path = require('path');

const sharp = require('sharp');
const fs = require('fs-extra');

export const generateThumbs = functions.storage
  .object()
  .onFinalize(async (object: any) => {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name; // get full path to file in bucket
    const fileName = filePath.split('/').pop();
    const bucketDir = path.dirname(filePath);

    const workingDir = path.join(os.tmpdir(), 'thumbs');
    const tmpFilePath = path.join(workingDir, 'source.png'); // should this be jpg or anything?

    // exit function if image has already been resized, or if there is no image in the upload
    if (fileName.includes('thumb@') || !object.contentType.includes('image')) {
      console.log('exiting function');
      return false;
    }

    // 1. Ensure thumbnail dir exists
    await fs.ensureDir(workingDir);

    // 2. Download Source File
    await bucket.file(filePath).download({
      destination: tmpFilePath
    });

    // 3. Resize the images and define an array of upload promises
    const sizes = [64, 128, 256];

    const uploadPromises = sizes.map(async size => {
      const thumbName = `thumb@${size}_${fileName}`;
      const thumbPath = path.join(workingDir, thumbName);

      // Resize source image
      await sharp(tmpFilePath)
        .resize(size, size)
        .toFile(thumbPath);

      // Upload to GCS
      return bucket.upload(thumbPath, {
        destination: path.join(bucketDir, thumbName)
      });
    });

    // 4. Run the upload operations
    await Promise.all(uploadPromises);

    // 5. Cleanup remove the tmp/thumbs from the filesystem
    return fs.remove(workingDir);
  });


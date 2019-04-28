import * as functions from 'firebase-functions';
import { Storage } from '@google-cloud/storage';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs-extra';
import * as cors from 'cors';
import * as Busboy from 'busboy';

const gcs = new Storage();
const corsHandler = cors({origin: true});

export const generateThumbs = functions.storage
  .object()
  .onFinalize(async (object: any) => {
    const bucket = gcs.bucket(object.bucket);
    const filePath = object.name; // get full path to file in bucket
    const fileName = filePath.split('/').pop();
    const bucketDir = dirname(filePath);

    const workingDir = join(tmpdir(), 'thumbs');
    const tmpFilePath = join(workingDir, 'source.png'); // should this be jpg or anything?

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
    const sizes = [400];

    const uploadPromises = sizes.map(async size => {
      const thumbName = `thumb@${size}_${fileName}`;
      const thumbPath = join(workingDir, thumbName);

      // Resize source image
      await sharp(tmpFilePath)
        .resize(size)
        .toFile(thumbPath);

      // Upload to GCS
      return bucket.upload(thumbPath, {
        destination: join(bucketDir, thumbName)
      });
    });

    // 4. Run the upload operations
    await Promise.all(uploadPromises);

    // 5. Cleanup remove the tmp/thumbs from the filesystem
    return fs.remove(workingDir);
  });


  export const uploadFile = functions.https
    .onRequest((req: any, res: any) => {
      corsHandler(req, res, () => {
        if (req.method !== 'POST') {
          return res.status(500).json({
            message: 'Not allowed'
          })
        }
        const busboy = new Busboy({ headers: req.headers });
        let uploadData: any = null;

        busboy.on('file', (fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
          const filepath = join(tmpdir(), filename);
          uploadData = {file: filepath, type: mimetype};
          file.pipe(fs.createWriteStream(filepath))
        });

        busboy.on('finish', () => {
          const bucket = gcs.bucket('heinz-brummel-jewelry.appspot.com');
          const options = {
            uploadType: 'media',
            metadata: {
              metadata: {
                contentType: uploadData.type
              }
            }
          }
          bucket.upload(uploadData.file, options)
            .then(() => {
              res.status(200).json({
                message: 'IT WORKED'
              });
            })
            .catch(err => {
              res.status(500).json({
                error: err
              });
            });
        });
        busboy.end(req.rawBody);
      });
    });


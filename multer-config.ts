import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.aws' });

const s3Config = new S3Client({
  region: process.env.AWS_REGION, //região
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, //chave de acesso
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, //chave de acesso secreta
  },
});

const multerConfig = {
  storage: multerS3({
    s3: s3Config,
    bucket: 'upload-payments-mybank',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: process.env.ACL,
    key: (req, file, cb) => {
      const fileName =
        path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv4();

      const extension = path.parse(file.originalname).ext;
      cb(null, `${fileName}${extension}`);
    },
  }),
};

export default multerConfig;

import AWS from "aws-sdk";

import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from "./index.js";

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID?.trim(),
  secretAccessKey: AWS_SECRET_ACCESS_KEY?.trim(),
  region: AWS_REGION?.trim(),
  signatureVersion: "v4",
});

export default s3;

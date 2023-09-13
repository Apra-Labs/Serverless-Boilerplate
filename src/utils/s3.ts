import { CreateBucketCommand, DeleteObjectCommand, GetObjectCommand, PutBucketCorsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileUploadParams, S3GetSignedURLParam } from '../interfaces/common';

const s3Client = new S3Client({});

export const createS3Bucket = async (bucketName: string, cors: boolean = false) => {
    try {
        const data = await s3Client.send(new CreateBucketCommand({
            Bucket: bucketName,
        }));

        if (cors) {
            s3Client.send(new PutBucketCorsCommand({
                Bucket: bucketName,
                CORSConfiguration: {
                    CORSRules: [
                        {
                            AllowedHeaders: [
                                "*"
                            ],
                            AllowedMethods: [
                                "PUT",
                                "HEAD",
                            ],
                            AllowedOrigins: [
                                "*"
                            ],
                            MaxAgeSeconds: 3000
                        }
                    ]
                },
            }));
        }
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

export const uploadFileToS3 = async (params: FileUploadParams) => {
    try {
        if (params.fileEncoding == 'base64') {
            params.type = params.type || params.fileContent.split(';')[0].split('/')[1];
            params.fileContent = Buffer.from(params.fileContent.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        }
        const data = await s3Client.send(new PutObjectCommand({
            Bucket: params.bucketName,
            Key: params.fileName,
            Body: params.fileContent,
            ContentType: params.type
        }));

        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
    }
}

export const DeleteFileFromS3 = async (bucketName: string, fileName: string) => {
    try {
        const resp = await s3Client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileName
        }));
        return resp;
    } catch (err) {
        console.log(err);
    }
}

export const getS3SignedURL = async (param: S3GetSignedURLParam) => {
    try {
        const cmd = new GetObjectCommand({
            Bucket: param.bucketName,
            Key: param.objectName,
        });

        const url = await getSignedUrl(s3Client, cmd, { expiresIn: param.expiryTime });
        return url;
    } catch (err) {
        console.log(err);
    }
}

export const getSignedPictureURL = async (pictureKey: string) => {
    const param: S3GetSignedURLParam = {
        bucketName: process.env.MEDIA_BUCKET,
        objectName: pictureKey,
        expiryTime: parseInt(process.env.S3_SIGNED_URL_EXPIRE_TIME)
    }
    return getS3SignedURL(param);
}


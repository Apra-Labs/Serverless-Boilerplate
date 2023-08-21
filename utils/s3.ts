import { CreateBucketCommand, PutBucketCorsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

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


export const publicFileUploadToBucket = async (bucketName: string, fileName: string, fileData: any) => { 
    try {
        const data = await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileData.data,
            ContentEncoding: fileData.encoding,
            ContentType: fileData.mimeType,
        }));

        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
    }
}  


export const publicUploadToBucketBase64Image = async (bucketName: string, fileName: string, base64String: string, type: string) => {
    try{
        type = type || base64String.split(';')[0].split('/')[1];
        const data = await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
            ContentEncoding: 'base64',
            ContentType: `image/${type}`,
        }));

        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
    }
}


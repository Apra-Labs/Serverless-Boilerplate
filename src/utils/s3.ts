import { CreateBucketCommand, DeleteObjectCommand, PutBucketCorsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { FileUploadParams } from '../interfaces/common';

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


// export const publicFileUploadToBucket = async (bucketName: string, fileName: string, fileData: any) => { 
//     try {
//         const data = await s3Client.send(new PutObjectCommand({
//             Bucket: bucketName,
//             Key: fileName,
//             Body: fileData.data,
//             ContentEncoding: fileData.encoding,
//             ContentType: fileData.mimeType,
//         }));

//         console.log(data);
//         return data;
//     } catch (err) {
//         console.error(err);
//     }
// }  


// export const publicUploadToBucketBase64Image = async (bucketName: string, fileName: string, base64String: string, type: string) => {
//     try{
//         type = type || base64String.split(';')[0].split('/')[1];
//         const data = await s3Client.send(new PutObjectCommand({
//             Bucket: bucketName,
//             Key: fileName,
//             Body: Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
//             ContentEncoding: 'base64',
//             ContentType: `image/${type}`,
//         }));

//         console.log(data);
//         return data;
//     } catch (err) {
//         console.error(err);
//     }
// }

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
    try{
        const resp = await s3Client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileName
        })); 
        return resp;
    } catch (err) { 
        console.log('Error in deleting file from s3');
        console.log(err);
    }
}


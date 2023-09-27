import { FileUploadParams, S3GetSignedURLParam } from "../interfaces/common";
import { DeleteFileFromS3, getS3SignedURL, getSignedPictureURL, uploadFileToS3 } from "../utils/s3";




describe('S3', () => {
    it('should upload a file to S3', async () => {
        const params: FileUploadParams = {
            bucketName: 'apra-sls-nodejs-mediabucket-dev',
            fileName: 'test.txt',
            fileContent: 'Hello World',
            type: 'text/plain'
        }                   
        const data = await uploadFileToS3(params);
        console.log(data);
        expect(data).toBeDefined();
    });

    it('should delete a file from S3', async () => {
        const data = await DeleteFileFromS3('apra-sls-nodejs-mediabucket-dev', 'test.txt');
        expect(data).toBeDefined();
    });

    it('should get a signed URL for a file in S3', async () => {
        const param: S3GetSignedURLParam = {
            bucketName: 'apra-sls-nodejs-mediabucket-dev',
            objectName: 'test.txt',
            expiryTime: 300
        }
        const url = await getS3SignedURL(param)
        console.log(url);
        expect(url).toBeDefined();
    });

    it('should get a signed URL for a picture in S3', async () => {
        const url = await getSignedPictureURL('test.txt');
        expect(url).toBeDefined();
    });
});
import { deleteDoc, insertDoc, scanDocs, updateDoc } from "../utils/dynamoDB";

describe('deleteDoc', () => {

    // Test case 1: Empty key deletion
    it('should throw invalid key error', async () => {
        try {
            const params = { TableName: 'apra-sls-nodejs-users-dev', Key: { userId: '' } };
            const result = await deleteDoc(params);
            expect(result).toBeUndefined();
        } catch (err) {
            expect(err.message).toContain('One or more parameter values are not valid');
        }
    });

    // Test case 2: Error handling for DynamoDB failure
    it('should throw non-existent table error', async () => {
        const params = { TableName: 'NonExistentTable', Key: { userId: '123' } };
        try {
            await deleteDoc(params);
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.$metadata.httpStatusCode).toEqual(400);
            expect(error.message).toContain('Cannot do operations on a non-existent table');
        }
    });

    // Test case 3: Handle deletion successfully
    it('should handle deletion successfully', async () => {
        const params = { TableName: 'apra-sls-nodejs-users-dev', Key: { userId: '45858bae-3106-46ff-9851-d314eaf8ed7a', } };
        const result = await deleteDoc(params);
        console.log(result);
        expect(result.$metadata.httpStatusCode).toEqual(200);
        expect(result).toBeUndefined();
    });

});


describe('insertDoc', () => {

    it('should insert item into table', async () => {
        const params = {
            TableName: 'apra-sls-nodejs-users-dev',
            Item: {
                userId: '123',
                userName: 'test',
                userAddress: 'test'
            }
        };

        const result = await insertDoc(params);
        expect(result.$metadata.httpStatusCode).toEqual(200);
    });

    it('should handle DynamoDB error', async () => {
        const params = {
            TableName: 'NonExistentTable',
            Item: {
                userId: '123',
                userName: 'test',
                userAddress: 'test'
            }
        };

        try {
            await insertDoc(params);
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.message).toContain('Cannot do operations on a non-existent table');
        }
    });

    it('should throw invalid key error', async () => {
        try {
            const params = {
                TableName: 'apra-sls-nodejs-users-dev',
                Item: {
                    userId: '',
                    userName: 'test',
                    userAddress: 'test address'
                }
            };

            await insertDoc(params);
        } catch (err) {
            console.log(err);
            expect(err.message).toContain('One or more parameter values are not valid');
        }
    });

});


describe('updateDoc', () => {

    it('should update item into table', async () => {
        const params = {
            TableName: 'apra-sls-nodejs-users-dev',
            primaryKey: {
                userId: '2a089592-a707-4908-9ae7-95a19dae5368'
            },
            updateKey: {
                userName: 'Test Name',
                userAddress: 'Test Address',
            }
        };

        const result = await updateDoc(params);
        console.log(result);
        expect(result.$metadata.httpStatusCode).toEqual(200);
    });

    it('should handle DynamoDB error', async () => {
        const params = {
            TableName: 'NonExistentTable', primaryKey: {
                userId: '2a089592-a707-4908-9ae7-95a19dae5368'
            },
            updateKey: {
                userName: 'Test Name',
                userAddress: 'Test Address',
            }
        };

        try {
            await updateDoc(params);
        } catch (error) {
            console.log(error);
            expect(error).toBeDefined();
            expect(error.message).toContain('Cannot do operations on a non-existent table');
        }
    });

    it('should throw invalid key error', async () => {
        try {
            const params = {
                TableName: 'apra-sls-nodejs-users-dev',
                primaryKey: {
                    userId: ''
                },
                updateKey: {
                    userName: 'Test Name',
                    userAddress: 'Test Address',
                }
            };
            await updateDoc(params);
        } catch (err) {
            console.log(err);
            expect(err.message).toContain('One or more parameter values are not valid');
        }
    });

});

describe('scanDocs', () => {

    // Test case 1: Invalid table scanning
    it('should throw invalid key error', async () => {
        try {
            const params = { tableName: '' };
            const result = await scanDocs(params.tableName, {});
            expect(result).toBeUndefined();
        } catch (err) {
            expect(err.message).toContain('Invalid table/index name');
        }
    });

    // Test case 2: Error handling for DynamoDB failure
    it('should throw non-existent table error', async () => {
        const params = { tableName: 'NonExistentTable' };
        try {
            await scanDocs(params.tableName, {});
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.$metadata.httpStatusCode).toEqual(400);
            expect(error.message).toContain('Cannot do operations on a non-existent table');
        }
    });

    // Test case 3: Handle scanning successfully
    it('should handle scanning successfully', async () => {
        const params = { tableName: 'apra-sls-nodejs-users-dev' };
        const result = await scanDocs(params.tableName, {});
        console.log(result);
        expect(result).toBeDefined();
    });

});




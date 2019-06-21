import * as dynamoDbLib from '../../libs/dynamodb-lib';

// Base version of CRUD DELETE. Only returns DB response
// Non-Base versions return objects containing DB response, status code and headers

export default (params) =>
    new Promise((resolve) =>
        dynamoDbLib
            .call('delete', params)
            .then(() => resolve(true))
            .catch((err) => {
                if (err.code === 'ConditionalCheckFailedException') {
                    resolve(undefined);
                }
                console.log(err.message);
                resolve(false);
            }));

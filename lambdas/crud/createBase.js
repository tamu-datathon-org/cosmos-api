import * as dynamoDbLib from '../../libs/dynamodb-lib';

// Base version of CRUD CREATE. Only returns DB response
// Non-Base versions return objects containing DB response, status code and headers

export default params => new Promise((resolve, reject) =>
    dynamoDbLib
        .call('put', params)
        .then(() => resolve(params.Item))
        .catch((err) => {
            console.log(err.message);
            if (err.code === 'ConditionalCheckFailedException') {
                resolve(undefined);
            }
            reject('DB Error');
        }));

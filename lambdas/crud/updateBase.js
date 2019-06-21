import * as dynamoDbLib from '../../libs/dynamodb-lib';

// Base version of CRUD UPDATE. Only returns DB response
// Non-Base versions return objects containing DB response, status code and headers

export default (params) =>
    new Promise((resolve) =>
        dynamoDbLib
            .call('update', params)
            .then(() => resolve(true))
            .catch((err) => {
                console.log(err.message);
                resolve(false);
            }));

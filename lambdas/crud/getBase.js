import * as dynamoDbLib from '../../libs/dynamodb-lib';

// Base version of CRUD GET. Only returns DB response
// Non-Base versions return objects containing DB response, status code and headers

export default (params) =>
    new Promise((resolve, reject) =>
        dynamoDbLib
            .call('get', params)
            .then((result) => {
                return result.Item
                    ? resolve(result.Item)
                    : resolve(undefined);
            })
            .catch((err) => {
                console.log(err.message);
                reject('DB Error');
            }));

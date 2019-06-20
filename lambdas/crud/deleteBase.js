import * as dynamoDbLib from '../../libs/dynamodb-lib';

// Base version of CRUD DELETE
// Only returns items instead of lambda return values

export default (params) =>
    new Promise((resolve) =>
        dynamoDbLib
            .call('delete', params)
            .then(() => resolve(true))
            .catch((err) => {
                console.log(err.message);
                resolve(false);
            }));

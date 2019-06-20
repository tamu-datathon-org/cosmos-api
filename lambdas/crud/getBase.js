import * as dynamoDbLib from '../../libs/dynamodb-lib';

// Base version of CRUD GET
// Only returns items instead of lambda return values

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

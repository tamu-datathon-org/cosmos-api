import * as dynamoDbLib from '../../libs/dynamodb-lib';

// Base version of CRUD CREATE
// Only returns items instead of lambda return values

export default (params) =>
    new Promise((resolve, reject) =>
        dynamoDbLib
            .call('put', params)
            .then(() => resolve(params.Item))
            .catch((err) => {
                console.log(err.message);
                reject("DB Error");
            })
    );

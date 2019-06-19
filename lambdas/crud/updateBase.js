import * as dynamoDbLib from '../../libs/dynamodb-lib';

// Base version of CRUD UPDATE
// Only returns items instead of lambda return values

export default (params) =>
    new Promise((resolve) =>
        dynamoDbLib
            .call('update', params)
            .then(() => resolve(true))
            .catch((err) => {
                console.log(err.message);
                resolve(false);
            })
    );

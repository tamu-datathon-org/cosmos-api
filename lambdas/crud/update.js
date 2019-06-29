import * as dynamoDbLib from '../../libs/dynamodb-lib';

export default (params) =>
    new Promise((resolve) =>
        dynamoDbLib
            .call('update', params)
            .then(() => resolve(true))
            .catch((err) => {
                console.log(err);
                resolve(false);
            }));

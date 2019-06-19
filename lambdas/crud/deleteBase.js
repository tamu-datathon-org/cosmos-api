import * as dynamoDbLib from '../../libs/dynamodb-lib';

export default (params) =>
    new Promise((resolve) =>
        dynamoDbLib
            .call('delete', params)
            .then(() => resolve(true))
            .catch((err) => {
                console.log(err.message);
                resolve(false);
            })
    );

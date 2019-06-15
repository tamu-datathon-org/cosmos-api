import * as dynamoDbLib from '../../libs/dynamodb-lib';

export default (params) =>
    new Promise((resolve, reject) =>
        dynamoDbLib
            .call('get', params)
            .then((result) =>
                result.Item
                    ? resolve(result.Item)
                    : resolve(undefined)
            )
            .catch((err) => {
                console.log(err.message);
                reject("DB Error");
            })
    );

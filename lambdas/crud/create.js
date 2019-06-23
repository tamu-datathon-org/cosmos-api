import * as dynamoDbLib from '../../libs/dynamodb-lib';

const itemBody = (item) => ({
    data: item,
    errors: [],
});

const msgBody = (message) => ({
    data: {},
    errors: [message],
});

export default (params) =>
    new Promise((resolve, reject) =>
        dynamoDbLib
            .call('put', params)
            .then(() => resolve(itemBody(params.Item)))
            .catch(({ message }) => {
                reject(msgBody(message));
            }));

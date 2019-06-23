import * as dynamoDbLib from '../../libs/dynamodb-lib';

const itemBody = (item) => ({
    data: item,
    errors: [],
});

const msgBody = (message) => ({
    data: {},
    errors: [message],
});

const notFoundBody = {
    data: {},
    errors: ['Item not found.'],
};

export default (params) =>
    new Promise((resolve, reject) =>
        dynamoDbLib
            .call('get', params)
            .then(({ Item }) => (Item ? resolve(itemBody(Item)) : reject(notFoundBody)))
            .catch(({ message }) => reject(msgBody(message))));

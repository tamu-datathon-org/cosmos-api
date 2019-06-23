import * as dynamoDbLib from '../../libs/dynamodb-lib';

const emptyBody = {
    data: {},
    errors: [],
};

const msgBody = (message) => ({
    data: {},
    errors: [message],
});

export default (params) =>
    new Promise((resolve, reject) =>
        dynamoDbLib
            .call('delete', params)
            .then(() => resolve(emptyBody))
            .catch(({ message }) => reject(msgBody(message))));

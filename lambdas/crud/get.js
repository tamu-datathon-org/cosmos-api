import * as dynamoDbLib from '../../libs/dynamodb-lib';

export default (params) =>
    new Promise((resolve, reject) =>
        dynamoDbLib
            .call('get', params)
            .then(({ Item }) => (Item ? resolve(Item) : reject({ message: 'Item not found.' })))
            .catch(reject));

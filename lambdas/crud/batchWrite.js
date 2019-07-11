import * as dynamoDbLib from '../../libs/dynamodb-lib';

export default params => new Promise((resolve, reject) => dynamoDbLib
    .call('batchWrite', params)
    .then(resolve)
    .catch(reject));

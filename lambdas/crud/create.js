import * as dynamoDbLib from '../../libs/dynamodb-lib';

export default params => new Promise((resolve, reject) => dynamoDbLib
    .call('put', params)
    .then(() => resolve(params.Item))
    .catch(reject));

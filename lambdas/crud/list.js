import * as dynamoDbLib from '../../libs/dynamodb-lib';

export default params => new Promise((resolve, reject) => dynamoDbLib
    .call('query', params)
    .then(({ Items }) => resolve(Items))
    .catch(reject));

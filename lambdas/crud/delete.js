import * as dynamoDbLib from '../../libs/dynamodb-lib';

export default (params) => dynamoDbLib.call('delete', params);

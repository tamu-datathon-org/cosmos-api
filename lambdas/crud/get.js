import * as dynamoDbLib from '../../libs/dynamodb-lib';
import { success, failure } from '../../libs/response-lib';

export default (params) =>
    new Promise((resolve) =>
        dynamoDbLib
            .call('get', params)
            .then((result) => {
                return result.Item
                    ? resolve(success(result.Item))
                    : resolve(failure({ status: false, error: 'Item not found.' }));
            })
            .catch((err) => {
                console.log(err.message);
                resolve(failure({ status: false }));
            }));

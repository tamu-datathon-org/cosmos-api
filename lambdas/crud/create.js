import * as dynamoDbLib from '../../libs/dynamodb-lib';
import {
    success,
    failure,
} from '../../libs/response-lib';

export default (params) =>
    new Promise((resolve) =>
        dynamoDbLib
            .call('put', params)
            .then(() => resolve(success(params.Item)))
            .catch((err) => {
                console.log(err.message);
                resolve(failure({
                    status: false
                }));
            }));

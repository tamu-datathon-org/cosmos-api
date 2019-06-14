import * as dynamoDbLib from '../../libs/dynamodb-lib';
import { success, failure } from '../../libs/response-lib';

export default (params) =>
    new Promise((resolve) =>
        dynamoDbLib
            .call('delete', params)
            .then(() => resolve(success({ status: true })))
            .catch((err) => {
                console.log(err.message);
                resolve(failure({ status: false }));
            })
    );

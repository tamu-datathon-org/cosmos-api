import * as dynamoDbLib from '../../libs/dynamodb-lib';
import { success, failure } from '../../libs/response-lib';

export default (params) =>
    new Promise((resolve, reject) =>
        dynamoDbLib
            .call('put', params)
            .then(() => resolve(params.Item))
            .catch((err) => {
                console.log(err.message);
                reject("DB Error");
            })
    );

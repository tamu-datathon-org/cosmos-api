import * as dynamoDbLib from '../../libs/dynamodb-lib';
import { success, failure } from '../../libs/response-lib';

export default (params) =>
    new Promise((resolve) =>
        dynamoDbLib
            .call('update', params)
            .then(() =>
                resolve(
                    success({
                        data: {},
                        errors: [],
                    }),
                ))
            .catch(({ message }) => {
                resolve(
                    failure({
                        data: {},
                        errors: [message],
                    }),
                );
            }));

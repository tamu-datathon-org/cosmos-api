import * as dynamoDbLib from '../../libs/dynamodb-lib';
import { success, failure } from '../../libs/response-lib';

export default (params) =>
    new Promise((resolve) =>
        dynamoDbLib
            .call('query', params)
            .then(({ Items }) =>
                resolve(
                    success({
                        data: Items,
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

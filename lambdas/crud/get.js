import * as dynamoDbLib from '../../libs/dynamodb-lib';
import { success, failure } from '../../libs/response-lib';

export default (params) =>
    new Promise((resolve) =>
        dynamoDbLib
            .call('get', params)
            .then(({ Item }) => {
                return Item
                    ? resolve(
                        success({
                            data: Item,
                            errors: [],
                        }),
                    )
                    : resolve(failure({ data: {}, errors: ['Item not found.'] }));
            })
            .catch(({ message }) => {
                resolve(
                    failure({
                        data: {},
                        errors: [message],
                    }),
                );
            }));

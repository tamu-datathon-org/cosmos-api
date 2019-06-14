import _delete from '../crud/delete';

const prepare = (event) =>
    new Promise((resolve) => {
        const params = {
            TableName: process.env.attemptsTableName,
            // 'Key' defines the partition key and sort key of the item to be retrieved
            // - 'userId': Identity Pool identity id of the authenticated user
            // - 'eventd': path parameter
            Key: {
                userId: event.requestContext.identity.cognitoIdentityId,
                attemptId: event.pathParameters.id,
            },
        };
        resolve(params);
    });

export const main = (event) =>
    new Promise((resolve) =>
        prepare(event)
            .then(_delete)
            .then(resolve)
    );

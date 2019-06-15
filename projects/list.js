import list from '../lambdas/crud/list';

const prepare = (event) =>
    new Promise((resolve) => {
        const params = {
            TableName: process.env.projectsTableName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': event.requestContext.identity.cognitoIdentityId,
            },
        };
        resolve(params);
    });

export const main = (event) =>
    new Promise((resolve) =>
        prepare(event)
            .then(list)
            .then(resolve)
    );
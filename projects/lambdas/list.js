import list from '../../lambdas/crud/list';

export const main = (event) =>
    list({
        TableName: process.env.projectsTableName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': event.requestContext.identity.cognitoIdentityId,
        },
    });

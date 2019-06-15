import get from '../../lambdas/crud/get';

export const main = (event) =>
    get({
        TableName: process.env.projectsTableName,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            project: event.pathParameters.project,
        },
    });

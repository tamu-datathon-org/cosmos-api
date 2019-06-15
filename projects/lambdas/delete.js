import _delete from '../../lambdas/crud/delete';

export const main = (event) =>
    _delete({
        TableName: process.env.projectsTableName,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            project: event.pathParameters.project,
        },
    });

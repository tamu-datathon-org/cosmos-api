import _delete from '../lambdas/crud/delete';

const prepare = (event) =>
    new Promise((resolve) => {
        const params = {
            TableName: process.env.projectsTableName,
            Key: {
                userId: event.requestContext.identity.cognitoIdentityId,
                project: event.pathParameters.project,
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

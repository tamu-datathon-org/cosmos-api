import create from '../../lambdas/crud/create';

const prepare = (event) => {
    const { project, lessons } = JSON.parse(event.body);
    return {
        TableName: process.env.projectsTableName,
        Item: {
            project,
            lessons,
            userId: event.requestContext.identity.cognitoIdentityId,
            createdAt: Date.now(),
        },
    };
};

export const main = (event) => create(prepare(event));

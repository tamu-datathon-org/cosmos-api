import create from '../lambdas/crud/create';

const prepare = (event) =>
    new Promise((resolve) => {
        const data = JSON.parse(event.body);
        const params = {
            TableName: process.env.projectsTableName,
            Item: {
                project: data.project,
                userId: event.requestContext.identity.cognitoIdentityId,
                lessons: data.lessons,
                createdAt: Date.now(),
            },
        };
        resolve(params);
    });

export const main = (event) =>
    new Promise((resolve) =>
        prepare(event)
            .then(create)
            .then(resolve)
    );

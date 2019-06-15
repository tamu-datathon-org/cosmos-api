import read from '../lambdas/crud/read';

const prepare = (event) =>
    new Promise((resolve) => {
        const params = {
            TableName: process.env.projectsTableName,
            Key: {
                project: event.pathParameters.project,
            },
        };
        resolve(params);
    });

export const main = (event) =>
    new Promise((resolve) =>
        prepare(event)
            .then(read)
            .then(resolve)
    );

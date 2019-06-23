import get from '../crud/get';

export const main = (event) =>
    get({
        TableName: process.env.projectsTableName,
        Key: {
            projectId: event.pathParameters.projectId,
        },
    });

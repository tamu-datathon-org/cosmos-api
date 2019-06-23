import _delete from '../crud/delete';

export const main = (event) =>
    _delete({
        TableName: process.env.projectsTableName,
        Key: {
            projectId: event.pathParameters.projectId,
        },
    });

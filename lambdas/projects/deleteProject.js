import _delete from '../crud/delete';
import { success, failure } from '../../libs/response-lib';

export const main = (event) =>
    _delete({
        TableName: process.env.projectsTableName,
        Key: {
            projectId: event.pathParameters.projectId,
        },
    })
        .then(success)
        .catch(failure);

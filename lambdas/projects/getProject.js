import get from '../crud/get';
import { success, failure } from '../../libs/response-lib';

export const main = (event) =>
    get({
        TableName: process.env.projectsTableName,
        Key: {
            projectId: event.pathParameters.projectId,
        },
    })
        .then(success)
        .catch(failure);

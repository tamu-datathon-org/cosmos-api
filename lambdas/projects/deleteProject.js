import _delete from '../crud/delete';
import {
    success, failure, emptyBody, errorBody,
} from '../../libs/response-lib';

export const main = (event) =>
    _delete({
        TableName: process.env.projectsTableName,
        Key: {
            projectId: event.pathParameters.projectId,
        },
    })
        .then(() => success(emptyBody))
        .catch(({ message }) => failure(errorBody(message)));

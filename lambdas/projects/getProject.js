import get from '../crud/get';
import {
    success, failure, dataBody, errorBody,
} from '../../libs/response-lib';

export const main = (event) =>
    get({
        TableName: process.env.projectsTableName,
        Key: {
            projectId: event.pathParameters.projectId,
        },
    })
        .then((item) => success(dataBody(item)))
        .catch(({ message }) => failure(errorBody(message)));

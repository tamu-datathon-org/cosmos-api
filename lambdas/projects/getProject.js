import get from '../crud/get';
import { failure, dataSuccess, notFoundFailure } from '../../libs/response-lib';

const project = (event) => ({
    TableName: process.env.projectsTableName,
    Key: {
        projectId: event.pathParameters.projectId,
    },
});

export const main = (event) =>
    get(project(event))
        .then(({ Item }) => (Item ? dataSuccess(Item) : notFoundFailure()))
        .catch(failure);

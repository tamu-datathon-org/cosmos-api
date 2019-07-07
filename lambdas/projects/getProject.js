import get from '../crud/get';
import { failure, success, notFoundFailure } from '../../libs/response-lib';

const project = (event) => ({
    TableName: process.env.projectsTableName,
    Key: {
        projectId: event.pathParameters.projectId,
    },
});

export const main = (event) =>
    get(project(event))
        .then(({ Item }) => (Item ? success(Item) : notFoundFailure()))
        .catch(failure);

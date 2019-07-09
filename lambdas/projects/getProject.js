import get from '../crud/get';
import { failure, success, notFound } from '../../libs/response-lib';

const project = (event) => ({
    TableName: process.env.projectsTableName,
    Key: {
        projectId: event.pathParameters.projectId,
    },
});

export const main = (event) =>
    get(project(event))
        .then(({ Item }) => (Item ? success(Item) : notFound()))
        .catch(failure);

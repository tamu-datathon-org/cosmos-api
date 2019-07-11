import get from '../crud/get';
import list from '../crud/list';
import { failure, success, notFound } from '../../libs/response-lib';

<<<<<<< HEAD
const prepare = (event) => ({
    projectsTable: process.env.projectsTableName,
    challengesTable: process.env.challengesTableName,
    projectKey: {
=======
const project = event => ({
    TableName: process.env.projectsTableName,
    Key: {
>>>>>>> origin/master
        projectId: event.pathParameters.projectId,
    },
});

<<<<<<< HEAD
const getProject = (event) => {
    const { projectsTable, challengesTable, projectKey} = prepare(event);
    try{
        const projectPromise = get({
            TableName: projectsTable,
            Key: projectKey,
        })
        const challengesPromise = list({
            TableName: challengesTable,
            KeyConditionExpression: 'projectId = :projectId',
            ExpressionAttributeValues: {
                ':projectId': projectKey.projectId,
            },
        });
        const [project, challenges] = Promise.all([projectPromise, challengesPromise]);
        if (project.Item === undefined) {
            return notFound('A project with the specified ID could not be found');
        }
        return success({
            ...project,
            challenges: challenges || [],
        })
    } catch(err) {
        return failure(err);
    }
}

export const main = getProject;
=======
export const main = event => get(project(event))
    .then(({ Item }) => (Item ? success(Item) : notFound()))
    .catch(failure);
>>>>>>> origin/master

import get from '../crud/get';
import list from '../crud/list';
import { failure, success, notFound } from '../../libs/response-lib';

const prepare = event => ({
    projectsTable: process.env.projectsTableName,
    challengesTable: process.env.challengesTableName,
    projectKey: {
        projectId: event.pathParameters.id,
    },
});

const getProject = async (event) => {
    const { projectsTable, challengesTable, projectKey } = prepare(event);
    try {
        const projectPromise = get({
            TableName: projectsTable,
            Key: projectKey,
        });
        const challengesPromise = list({
            TableName: challengesTable,
            KeyConditionExpression: 'projectId = :projectId',
            ExpressionAttributeValues: {
                ':projectId': projectKey.projectId,
            },
        });
        const [project, challenges] = await Promise.all([projectPromise, challengesPromise]);
        if (project.Item === undefined) {
            return notFound('A project with the specified ID could not be found');
        }
        return success({
            ...project.Item,
            challenges: challenges || [],
        });
    } catch (err) {
        return failure(err);
    }
};

export const main = getProject;

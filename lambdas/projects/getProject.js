import get from '../crud/get';
import list from '../crud/list';
import { failure, success, notFound } from '../../libs/response-lib';

const prepare = event => ({
    projectsTableName: process.env.projectsTableName,
    challengesTable: process.env.challengesTableName,
    projectKey: {
        projectId: event.pathParameters.id,
    },
});

const getProjectCore = async ({ projectsTableName, challengesTable, projectKey }) => {
    const projectPromise = get({
        TableName: projectsTableName,
        Key: projectKey,
    });
    const challengesPromise = list({
        TableName: challengesTable,
        KeyConditionExpression: 'projectId = :projectId',
        ExpressionAttributeValues: {
            ':projectId': projectKey.projectId,
        },
    });
    const [{ Item: project }, challenges] = await Promise.all([projectPromise, challengesPromise]);
    if (project === undefined) {
        return notFound('A project with the specified ID could not be found');
    }
    return {
        ...project,
        challenges: challenges || [],
    };
};

const getProject = async (event) => {
    const eventData = prepare(event);
    try {
        const project = await getProjectCore(eventData);
        return success(project);
    } catch (err) {
        return failure(err);
    }
};

export const main = getProject;

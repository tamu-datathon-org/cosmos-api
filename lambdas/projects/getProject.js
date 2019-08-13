import get from '../crud/get';
import list from '../crud/list';
import { failure, success, notFound } from '../../libs/response-lib';
import { NotFoundError } from '../../libs/errors-lib';

const prepare = event => ({
    projectsTableName: process.env.projectsTableName,
    challengesTableName: process.env.challengesTableName,
    projectKey: {
        projectId: event.pathParameters.id,
    },
});

const getProjectCore = async ({ projectsTableName, challengesTableName, projectKey }) => {
    const projectPromise = get({
        TableName: projectsTableName,
        Key: projectKey,
    });
    const challengesPromise = list({
        TableName: challengesTableName,
        KeyConditionExpression: 'projectId = :projectId',
        ExpressionAttributeValues: {
            ':projectId': projectKey.projectId,
        },
    });
    const [{ Item: project }, challenges] = await Promise.all([projectPromise, challengesPromise]);
    if (project === undefined) {
        throw new NotFoundError('A project with the specified ID could not be found');
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
        if (err.name === 'NotFoundError') {
            return notFound(err.message);
        }
        console.log(err, err.stack);
        return failure(err.message);
    }
};

export const main = getProject;

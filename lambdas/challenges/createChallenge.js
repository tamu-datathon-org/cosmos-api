import create from '../crud/create';
import get from '../crud/get';
import {
    failure, conflict, unauthorized, resourceCreated, notFound,
} from '../../libs/response-lib';
import { verifyBodyParamsExist } from '../../libs/api-helper-lib';

const prepare = (event) => {
    const data = JSON.parse(event.body);
    return {
        challengesTableName: process.env.challengesTableName,
        adminTableName: process.env.projectAdminTableName,
        projectsTableName: process.env.projectTableName,
        challenge: {
            challengeId: data.challengeId,
            projectId: data.projectId,
            lessonId: data.lessonId,
            challengeName: data.challengeName,
            points: data.points,
            passingThreshold: data.passingThreshold,
            metric: data.metric,
            solution: data.solution,
            createdAt: Date.now(),
        },
        adminKey: {
            userId: event.requestContext.identity.cognitoIdentityId,
            projectId: data.projectId,
        },
        projectKey: {
            projectId: data.projectId,
        },
    };
};

const createChallenge = async (event) => {
    const {
        challengesTableName, adminTableName, projectsTableName, challenge, adminKey, projectKey,
    } = prepare(event);
    try {
        const { Item: userAdmin } = await get({
            TableName: adminTableName,
            Key: adminKey,
        });
        // Check that user is admin.
        if (userAdmin === undefined) {
            return unauthorized('Not authorized to access this project.');
        }
        const { Item: project } = await get({
            TableName: projectsTableName,
            Key: projectKey,
        });
        if (project === undefined) {
            return unauthorized('This project does not exist');
        }
        if (project.lessons.filter(lesson => lesson.lessonId === challenge.lessonId) === 0) {
            return notFound('This lesson does not exist');
        }
        const createdChallenge = await create({
            TableName: challengesTableName,
            Item: challenge,
            ConditionExpression:
                'attribute_not_exists(challengeId) AND attribute_not_exists(projectId)',
        });
        return resourceCreated(createdChallenge);
    } catch (err) {
        // The only condition on the create request is to check whether the challenge already
        // exists.
        if (err.code === 'ConditionalCheckFailedException') {
            return conflict(
                'A challenge for the specified project already exists for the given id.',
            );
        }
        return failure(err);
    }
};

export const main = verifyBodyParamsExist(
    [
        'challengeId',
        'projectId',
        'lessonId',
        'challengeName',
        'points',
        'passingThreshold',
        'metric',
        'solution',
    ],
    createChallenge,
);

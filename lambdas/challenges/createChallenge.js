import create from '../crud/create';
import get from '../crud/get';
import {
    failure, conflict, unauthorized, resourceCreated, badRequest,
} from '../../libs/response-lib';
import { verifyBodyParamsExist } from '../../libs/api-helper-lib';
import { isMetricSupported } from '../../libs/judgement-engine-lib';

const prepare = (event) => {
    const data = JSON.parse(event.body);
    return {
        challengesTable: process.env.challengesTableName,
        adminTable: process.env.projectAdminTableName,
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
    };
};

const createChallenge = async (event) => {
    const {
        challengesTable, adminTable, challenge, adminKey,
    } = prepare(event);
    try {
        if (!isMetricSupported(challenge.metric)) {
            return badRequest('The given metric is not supported');
        }
        const userAdmin = await get({
            TableName: adminTable,
            Key: adminKey,
        });
        // Check that user is admin.
        if (userAdmin.Item === undefined) {
            return unauthorized('Not authorized to access this project.');
        }
        const createdChallenge = await create({
            TableName: challengesTable,
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

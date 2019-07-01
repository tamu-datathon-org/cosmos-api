import get from '../crud/get';
import uuid from 'uuid';
import create from '../crud/create';
import { judge } from '../../libs/judgement-engine-lib';
import * as judgingErrors from '../../libs/judging/judging-errors';
import {
    HTTPCodes,
    failure,
    buildResponse,
    errorBody,
} from '../../libs/response-lib';
import {
    verifyBodyParamsExist,
} from '../../libs/api-helper-lib';
import {
    NotFoundError
} from '../../libs/errors-lib';

const prepare = (event) => {
    const data = JSON.parse(event.body);
    return {
        usersTableName: process.env.usersTableName,
        attemptsTableName: process.env.attemptsTableName,
        challengesTableName: process.env.challengesTableName,
        userKey: {
            email: data.email,
        },
        challengeKey: {
            challengeId: data.challengeId,
            projectId: data.projectId,
        },
        userSolution: data.solution,
    };
};

// Get user and challenge asynchronously to check existence of both and then resolve with
// challenge object.
const getUserAndChallenge = async (userKey, challengeKey, usersTableName, challengesTableName) => {
    const userPromise = get({
        TableName: usersTableName,
        Key: userKey,
    }).then((user) => {
        if (user.Item === undefined) {
            throw new NotFoundError('A user with the given email cannot be found.');
        }
        return user.Item;
    });

    const challengesPromise = get({
        TableName: challengesTableName,
        Key: challengeKey,
    }).then((challenge) => {
        if (challenge.Item === undefined) {
            throw new NotFoundError('A challenge with the given ID cannot be found in the given project.');
        }
        return challenge.Item;
    });

    return Promise.all([userPromise, challengesPromise])
};

const judgeAttempt = async (event) => {
    const {
        usersTableName,
        attemptsTableName,
        challengesTableName,
        userKey,
        challengeKey,
        userSolution,
    } = prepare(event);
    try {
        // Check if user and challenge exist
        const [user, challenge] = await getUserAndChallenge(userKey, challengeKey,
            usersTableName, challengesTableName);
        const {
            passingThreshold,
            solution,
            metric,
        } = challenge;
        const score = judge(userSolution, solution, metric);
        await create({
            TableName: attemptsTableName,
            Item: {
                userId: user.userId,
                challengeId: challenge.challengeId,
                projectId: challenge.projectId,
                attemptId: uuid.v1(),
                solution: userSolution,
                score: score,
            },
        });
        const passed = score >= passingThreshold;
        return buildResponse(HTTPCodes.SUCCESS, { passed: passed });
    } catch (err) {
        console.log(err);

        if (err instanceof NotFoundError) {
            return buildResponse(HTTPCodes.NOT_FOUND, errorBody(err.message));
        } else if (err instanceof judgingErrors.MetricNotFoundError) {
            return buildResponse(HTTPCodes.PRECONDITION_FAILED, errorBody('There was an error in judging your attempt. Please contact a project supervisor to resolve this problem.'));
        }

        return failure({
            error: err,
        });
    }
};

export const main = verifyBodyParamsExist(
    ['email', 'projectId', 'challengeId', 'solution'],
    judgeAttempt,
);
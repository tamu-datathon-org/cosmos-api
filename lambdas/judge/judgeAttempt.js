import uuid from 'uuid';
import create from '../crud/create';
import { judge } from '../../libs/judgement-engine-lib';
import * as judgingErrors from '../../libs/judging/judging-errors';
import {
    resourceCreated,
    failure,
    notFound,
    preconditionFailed,
} from '../../libs/response-lib';
import {
    verifyBodyParamsExist,
} from '../../libs/api-helper-lib';
import {
    NotFoundError,
} from '../../libs/errors-lib';
import { getUserAndChallenge, PROJECT_CHALLENGE_ID_SEPARATOR } from './judgement-handlers-helper';

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
                projectChallengeId: challenge.projectId
                    + PROJECT_CHALLENGE_ID_SEPARATOR + challenge.challengeId,
                attemptId: uuid.v1(),
                solution: userSolution,
                score: score,
            },
        });
        const passed = score >= passingThreshold;
        return resourceCreated({
            passed: passed,
            points: (passed) ? challenge.points : 0,
        });
    } catch (err) {
        console.log(err);

        if (err instanceof NotFoundError) {
            return notFound(err.message);
        } else if (err instanceof judgingErrors.MetricNotFoundError) {
            return preconditionFailed('There was an error in judging your attempt. '
            + 'Please contact a project supervisor to resolve this problem.');
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
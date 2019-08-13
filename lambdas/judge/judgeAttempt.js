import uuid from 'uuid';
import create from '../crud/create';
import { judge } from '../../libs/judgement-engine-lib';
import {
    resourceCreated, failure, notFound, preconditionFailed, badRequest,
} from '../../libs/response-lib';
import { verifyBodyParamsExist } from '../../libs/api-helper-lib';
import { getUserAndChallenge } from '../../libs/helpers/scoring-helper-lib';

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
        const [user, challenge] = await getUserAndChallenge(
            userKey,
            challengeKey,
            usersTableName,
            challengesTableName,
        );
        const { passingThreshold, solution, metric } = challenge;
        const score = judge(userSolution, solution, metric);
        await create({
            TableName: attemptsTableName,
            Item: {
                userId: user.userId,
                projectId: challenge.projectId,
                challengeId: challenge.challengeId,
                attemptId: uuid.v4(),
                solution: userSolution,
                score,
            },
        });
        const passed = score >= passingThreshold;
        return resourceCreated({
            passed,
            points: passed ? challenge.points : 0,
            score,
        });
    } catch (err) {
        if (err.name === 'NotFoundError') {
            return notFound(err.message);
        } if (err.name === 'MetricNotFoundError') {
            return badRequest(
                'There was an error in judging your attempt. '
                + 'Please contact a project supervisor to resolve this problem.',
            );
        } if (err.name === 'NonBinaryAnswerError' || err.name === 'IncorrectAnswerLengthError') {
            return preconditionFailed(
                'Your answer was incorrect. Please try again.',
            );
        }
        return failure(err);
    }
};

export const main = verifyBodyParamsExist(
    ['email', 'projectId', 'challengeId', 'solution'],
    judgeAttempt,
);

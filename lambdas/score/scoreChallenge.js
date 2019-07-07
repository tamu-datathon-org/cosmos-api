import scan from '../crud/query';
import {
    success,
    failure,
    notFound,
} from '../../libs/response-lib';
import {
    verifyQueryParamsExist,
} from '../../libs/api-helper-lib';
import {
    NotFoundError,
} from '../../libs/errors-lib';
import { getUserAndChallenge, PROJECT_CHALLENGE_ID_SEPARATOR } from './score-handlers-helper';

const prepare = (event) => {
    return {
        usersTableName: process.env.usersTableName,
        attemptsTableName: process.env.attemptsTableName,
        challengesTableName: process.env.challengesTableName,
        userKey: {
            email: event.queryStringParameters.email,
        },
        challengeKey: {
            challengeId: event.pathParameters.challengeId,
            projectId: event.queryStringParameters.projectId,
        },
    };
};

const judgeChallengeForUser = async (event) => {
    const {
        usersTableName,
        attemptsTableName,
        challengesTableName,
        userKey,
        challengeKey,
    } = prepare(event);
    try {
        // Check if user and challenge exist
        const [user, challenge] = await getUserAndChallenge(userKey, challengeKey,
            usersTableName, challengesTableName);
        const userAttemptsResponse = await scan({
            TableName: attemptsTableName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': user.userId,
            },
        });
        let passed = false;
        let numAttempts = 0;
        userAttemptsResponse.Items.filter(
            item => item.projectChallengeId
                === (challenge.projectId + PROJECT_CHALLENGE_ID_SEPARATOR + challenge.challengeId),
        ).forEach((item) => {
            numAttempts += 1;
            if (item.score >= challenge.passingThreshold) passed = true;
        });
        return success({
            passed: passed,
            points: (passed) ? challenge.points : 0,
            numAttempts: numAttempts,
        });
    } catch (err) {
        console.log(err);
        if (err instanceof NotFoundError) {
            return notFound(err.message);
        }
        return failure({
            error: err,
        });
    }
};

export const main = verifyQueryParamsExist(
    ['projectId', 'challengeId', 'email'],
    judgeChallengeForUser,
);
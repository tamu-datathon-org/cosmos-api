import list from '../crud/list';
import { success, failure, notFound } from '../../libs/response-lib';
import { verifyQueryParamsExist } from '../../libs/api-helper-lib';
import { getUserAndChallenge } from '../../libs/helpers/scoring-helper-lib';

const prepare = event => ({
    usersTableName: process.env.usersTableName,
    attemptsTableName: process.env.attemptsTableName,
    challengesTableName: process.env.challengesTableName,
    userKey: {
        email: event.queryStringParameters.email,
    },
    challengeKey: {
        challengeId: event.pathParameters.id,
        projectId: event.queryStringParameters.projectId,
    },
});

export const scoreChallengeCore = async ({
    userKey,
    challengeKey,
    usersTableName,
    challengesTableName,
    attemptsTableName,
}) => {
    // Check if user and challenge exist
    const [user, { solution, ...challenge }] = await getUserAndChallenge(
        userKey,
        challengeKey,
        usersTableName,
        challengesTableName,
    );
    const userAttempts = await list({
        TableName: attemptsTableName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': user.userId,
        },
    });
    const matching = userAttempts.filter(
        item => item.projectId === challenge.projectId
            && item.challengeId === challenge.challengeId,
    );
    const numAttempts = matching.length;
    const passing = matching.filter(item => item.score >= challenge.passingThreshold);
    const passed = passing.length > 0;
    return {
        challenge,
        passed,
        points: passed ? challenge.points : 0,
        numAttempts,
    };
};

const judgeChallengeForUser = async (event) => {
    try {
        const scoreObj = await scoreChallengeCore(prepare(event));
        return success(scoreObj);
    } catch (err) {
        if (err.name === 'NotFoundError') {
            return notFound(err.message);
        }
        return failure(err);
    }
};

export const main = verifyQueryParamsExist(['projectId', 'email'], judgeChallengeForUser);

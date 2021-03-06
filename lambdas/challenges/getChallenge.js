import get from '../crud/get';
import { failure, success, notFound } from '../../libs/response-lib';
import { verifyQueryParamsExist } from '../../libs/api-helper-lib';

const prepare = event => ({
    challengesTableName: process.env.challengesTableName,
    adminTable: process.env.projectAdminTableName,
    challengeKey: {
        challengeId: event.pathParameters.id,
        projectId: event.queryStringParameters.projectId,
    },
    adminKey: {
        userId: event.requestContext.identity.cognitoIdentityId,
        projectId: event.queryStringParameters.projectId,
    },
});

const getChallenge = async (event) => {
    const {
        challengesTableName, adminTable, challengeKey, adminKey,
    } = prepare(event);
    try {
        // Get request will throw ConditionalCheckFailedException if challenge does not exist.
        const challenge = await get({
            TableName: challengesTableName,
            Key: challengeKey,
            ConditionExpression: 'attribute_exists(challengeId) AND attribute_exists(projectId)',
        });
        if (challenge.Item === undefined) {
            return notFound('No challenge exists for the given project with the specified ID.');
        }
        // Check if user is admin, and if not, don't return the challenge answers.
        const userAdmin = await get({
            TableName: adminTable,
            Key: adminKey,
        });
        if (userAdmin.Item === undefined) {
            const { solution, ...safeChallengeData } = challenge.Item;
            return success(safeChallengeData);
        }
        return success(challenge.Item);
    } catch (err) {
        if (err.code === 'ConditionalCheckFailedException') {
            return notFound('No challenge exists for the given project with the specified ID.');
        }
        console.log(err, err.stack);
        return failure(err.message);
    }
};

export const main = verifyQueryParamsExist(['projectId'], getChallenge);

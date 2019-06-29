import get from '../crud/get';
import update from '../crud/update';
import {
    HTTPCodes,
    failure,
    buildResponse,
    errorBody,
    dataBody,
} from '../../libs/response-lib';
import {
    verifyBodyParamsExist,
} from '../../libs/api-helper-lib';

const prepare = (event) => {
    const data = JSON.parse(event.body);
    return {
        challengesTable: process.env.challengesTableName,
        adminTable: process.env.projectAdminTableName,
        challengeKey: {
            challengeId: event.pathParameters.challengeId,
            projectId: data.projectId,
        },
        challengeData: {
            challengeName: data.challengeName,
            points: data.points,
            passingThreshold: data.passingThreshold,
            solution: data.solution,
        },
        adminKey: {
            userId: event.requestContext.identity.cognitoIdentityId,
            projectId: data.projectId,
        },
    };
};

const updateChallenge = async (event) => {
    const {
        challengesTable,
        adminTable,
        challengeKey,
        challengeData,
        adminKey,
    } = prepare(event);
    try {
        // Check if user is admin, and if not, don't return the challenge answers.
        const userAdmin = await get({
            TableName: adminTable,
            Key: adminKey,
        });
        if (userAdmin.Item === undefined) {
            return buildResponse(HTTPCodes.UNAUTHORIZED, errorBody('Not authorized to update this challenge.'));
        }
        // Get request will throw ConditionalCheckFailedException if challenge does not exist.
        const challengeGetResponse = await get({
            TableName: challengesTable,
            Key: challengeKey,
            ConditionExpression: 'attribute_exists(challengeId) AND attribute_exists(projectId)',
        });
        if (challengeGetResponse.Item === undefined) {
            return buildResponse(HTTPCodes.NOT_FOUND, errorBody('No challenge exists for the given project with the specified ID.'));
        }
        const existingChallenge = challengeGetResponse.Item;
        const isChallengeUpdated = await update({
            TableName: challengesTable,
            Key: challengeKey,
            UpdateExpression: 'SET challengeName = :challengeName, points = :points, passingThreshold = :passingThreshold, solution = :solution',
            ExpressionAttributeValues: {
                ':challengeName': challengeData.challengeName || existingChallenge.challengeName,
                ':points': challengeData.points || existingChallenge.points,
                ':passingThreshold': challengeData.passingThreshold || existingChallenge.passingThreshold,
                ':solution': challengeData.solution || existingChallenge.solution,
            },
            ReturnValues: 'ALL_NEW',
        });
        if (isChallengeUpdated) {
            return buildResponse(HTTPCodes.SUCCESS, dataBody({
                message: 'Challenge was successfully updated.',
            }));
        } else {
            return failure('There was an error is updating the user.');
        }
    } catch (err) {
        return failure(err);
    }
};

export const main = verifyBodyParamsExist(
    ['projectId'],
    updateChallenge,
);

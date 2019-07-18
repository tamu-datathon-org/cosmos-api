import _delete from '../crud/delete';
import get from '../crud/get';
import list from '../crud/list';
import { HTTPCodes, buildResponse } from '../../libs/response-lib';
import { verifyQueryParamsExist } from '../../libs/api-helper-lib';

const prepare = event => ({
    attemptsTableName: process.env.attemptsTableName,
    usersTableName: process.env.usersTableName,
    userKey: {
        email: event.queryStringParameters.email,
    },
    userId: event.requestContext.identity.cognitoIdentityId,
});

const deleteUser = async (event) => {
    const {
        attemptsTableName, usersTableName, userKey, userId,
    } = prepare(event);
    try {
        // Seperate userId and user
        const existingUserRequest = await get({
            TableName: usersTableName,
            Key: userKey,
        });
        const existingUser = existingUserRequest.Item;
        // User does not exist, return
        if (existingUser === undefined) {
            return buildResponse(HTTPCodes.NOT_FOUND, {
                error: 'User does not exist for the given credentials.',
            });
        }
        if (existingUser.userId !== userId) {
            // User exists, but userId for AWS cognito does not match
            return buildResponse(HTTPCodes.UNAUTHORIZED, {
                error: 'Not authorized to access this user.',
            });
        }
        await _delete({
            TableName: usersTableName,
            Key: userKey,
        });

        // Delete all the attempts from the given user.
        // TODO: Make batch request so that user does not get deleted if there is a failure
        // in deleteing the attempts.
        const userAttempts = await list({
            TableName: attemptsTableName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': existingUser.userId,
            },
        });
        if (userAttempts !== undefined) {
            const attemptsDeletePromises = userAttempts.map(attempt => _delete({
                TableName: attemptsTableName,
                Key: {
                    userId: existingUser.userId,
                    attemptId: attempt.attemptId,
                },
            }));
            await Promise.all(attemptsDeletePromises);
        }
        return buildResponse(HTTPCodes.SUCCESS, {
            message: 'User was successfully deleted.',
        });
    } catch (err) {
        return buildResponse(HTTPCodes.SERVER_ERROR, {
            error: 'The delete request could not be successfully completed.',
        });
    }
};

export const main = verifyQueryParamsExist(['email'], deleteUser);

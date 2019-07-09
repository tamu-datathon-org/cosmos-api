import get from '../crud/get';
import {
    HTTPCodes,
    failure,
    buildResponse,
} from '../../libs/response-lib';
import {
    verifyQueryParamsExist,
} from '../../libs/api-helper-lib';

const prepare = (event) => {
    return {
        tableName: process.env.usersTableName,
        userKey: {
            email: event.queryStringParameters.email,
        },
        userId: event.requestContext.identity.cognitoIdentityId,
    };
};

const getUser = async (event) => {
    const {
        tableName,
        userKey,
        userId,
    } = prepare(event);
    try {
        // Seperate userId and user.
        const existingUserRequest = await get({
            TableName: tableName,
            Key: userKey,
        });
        const existingUser = existingUserRequest.Item;
        // User does not exist, return.
        if (existingUser === undefined) {
            return buildResponse(HTTPCodes.NOT_FOUND, {
                error: 'User does not exist for the given credentials.',
            });
        } else if (existingUser.userId !== userId) {
            // User exists, but userId for AWS cognito does not match.
            return buildResponse(HTTPCodes.UNAUTHORIZED, {
                error: 'Not authorized to access this user.',
            });
        }
        // We do not send the userId in the response, so seperating userData from the ID.
        const {
            userId: existingUserId,
            ...userDataToSend
        } = existingUser;
        return buildResponse(HTTPCodes.SUCCESS, {
            user: userDataToSend,
        });
    } catch (err) {
        return failure({
            error: err,
        });
    }
};

export const main = verifyQueryParamsExist(['email'], getUser);

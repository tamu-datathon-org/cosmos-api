import _delete from '../crud/delete';
import get from '../crud/get';
import {
    HTTPCodes,
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
            projectId: event.queryStringParameters.projectId,
        },
        userId: event.requestContext.identity.cognitoIdentityId,
    };
};

const deleteUser = async (event) => {
    const {
        tableName,
        userKey,
        userId,
    } = prepare(event);
    try {
        // Seperate userId and user
        const existingUser = await get({
            TableName: tableName,
            Key: userKey,
        });
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
        const deleteSuccess = await _delete({
            TableName: tableName,
            Key: userKey,
        });
        if (deleteSuccess) {
            return buildResponse(HTTPCodes.SUCCESS, {
                message: 'User was successfully deleted.',
            });
        }
        return buildResponse(HTTPCodes.SERVER_ERROR, {
            error: 'The delete request could not be successfully completed.',
        });
    } catch (err) {
        return buildResponse(HTTPCodes.SERVER_ERROR, {
            error: 'The delete request could not be successfully completed.',
        });
    }
};

export const main = verifyQueryParamsExist(['email', 'projectId'], deleteUser);

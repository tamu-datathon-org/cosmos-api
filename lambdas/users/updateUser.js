import update from '../crud/update';
import get from '../crud/get';
import {
    HTTPCodes,
    failure,
    buildResponse,
} from '../../libs/response-lib';
import {
    verifyQueryParamsExist,
} from '../../libs/api-helper-lib';

// FIELDS ALLOWED TO UPDATE
// - First Name
// - Last Name

const prepare = (event) => {
    const data = JSON.parse(event.body);
    return {
        tableName: process.env.usersTableName,
        userUpdateData: {
            userId: event.requestContext.identity.cognitoIdentityId,
            firstName: data.firstName,
            lastName: data.lastName,
        },
        userData: {
            email: event.queryStringParameters.email,
            projectId: event.queryStringParameters.projectId,
        },
    };
};

const updateUser = async (event) => {
    const {
        tableName,
        userUpdateData,
        userData,
    } = prepare(event);
    try {
        const existingUserRequest = await get({
            TableName: tableName,
            Key: {
                email: userData.email,
                projectId: userData.projectId,
            },
        });
        const existingUser = existingUserRequest.Item;
        if (existingUser === undefined) {
            return buildResponse(HTTPCodes.NOT_FOUND, {
                error: 'User does not exist for the given credentials.',
            });
        }
        if (existingUser.userId !== userUpdateData.userId) {
            return buildResponse(HTTPCodes.UNAUTHORIZED, {
                error: 'Not authorized to access this user.',
            });
        }
        const userUpdated = await update({
            TableName: tableName,
            Key: {
                email: userData.email, // Partition key
                projectId: userData.projectId, // Sort key
            },
            UpdateExpression: 'SET firstName = :firstName, lastName = :lastName',
            ExpressionAttributeValues: {
                ':firstName': userUpdateData.firstName || existingUser.firstName,
                ':lastName': userUpdateData.lastName || existingUser.lastName,
            },
            ReturnValues: 'ALL_NEW',
        });
        if (userUpdated) {
            return buildResponse(HTTPCodes.SUCCESS, {
                message: 'User was successfully updated.',
            });
        } else {
            return failure({
                error: 'There was an error is updating the user.',
            });
        }
    } catch (err) {
        console.log(err);
        return failure({
            error: err,
        });
    }
};

export const main = verifyQueryParamsExist(['email', 'projectId'], updateUser);

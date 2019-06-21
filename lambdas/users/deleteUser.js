import _delete from '../crud/deleteBase';
import get from '../crud/getBase';
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
        const deleteSuccess = await _delete({
            TableName: tableName,
            Key: userKey,
            ConditionExpression: 'attribute_exists(email) AND attribute_exists(projectId) AND userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
        });
        if (deleteSuccess === undefined) {
            return buildResponse(HTTPCodes.UNAUTHORIZED, {
                error: 'No users exists for the given credentials.',
            });
        }
        if (deleteSuccess) {
            return buildResponse(HTTPCodes.SUCCESS, {
                message: 'User was successfully deleted.',
            });
        }
        return buildResponse(HTTPCodes.SERVER_ERROR, {
            error: 'The delete request could not be successfully completed.',
        });
    } catch (err) {
        console.log(err);
        return failure({
            error: err,
        });
    }
};

export const main = verifyQueryParamsExist(['email', 'projectId'], deleteUser);

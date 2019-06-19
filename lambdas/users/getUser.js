import get from '../crud/getBase';
import { HTTPCodes, failure, buildResponse } from '../../libs/response-lib';
import { verifyQueryParameters } from '../../libs/api-helper-lib';

const prepare = (event) => {
    return {
        tableName: process.env.usersTableName,
        userKey: {
            email: event.queryStringParameters.email,
            project: event.queryStringParameters.project,
        },
        userId: event.requestContext.identity.cognitoIdentityId,
    };
}

const getUser = async (event) => {
    var {tableName, userKey, userId} = prepare(event);
    try {
        // Seperate userId and user.
        var existingUser = await get({
            TableName: tableName,
            Key: userKey,
        })
        // User does not exist, return.
        if (existingUser == undefined) { 
            return buildResponse(HTTPCodes.NOT_FOUND, {'error': 'User does not exist for the given credentials.'})
        } 
        else if (existingUser.userId != userId){ // User exists, but userId for AWS cognito does not match.
            return buildResponse(HTTPCodes.UNAUTHORIZED, {'error': 'Not authorized to access this user.'})
        }
        // We do not send the userId in the response, so seperating userData from the ID.
        var {userId: existingUserId, ...userDataToSend} = existingUser;
        return buildResponse(HTTPCodes.SUCCESS, {user: userDataToSend})
    } 
    catch (err) {
        console.log(err)
        return failure({error: err})
    }
}

export const main = verifyQueryParameters(['email', 'project'], getUser)
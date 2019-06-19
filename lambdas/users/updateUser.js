import update from '../crud/updateBase';
import get from '../crud/getBase';
import { HTTPCodes, failure, buildResponse } from '../../libs/response-lib';
import { verifyQueryParameters } from '../../libs/api-helper-lib';

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
            project: event.queryStringParameters.project,
        }
    };
}

const updateUser = async (event) => {
    var {tableName, userUpdateData, userData} = prepare(event);
    try {
        var existingUser = await get({
            TableName: tableName,
            Key: {
                email: userData.email,
                project: userData.project,
            },
        });
        if (existingUser.userId != userUpdateData.userId) {
            return buildResponse(HTTPCodes.UNAUTHORIZED, {'error': 'Not authorized to access this user.'})
        }

        var userUpdated = await update({
            TableName: tableName,
            Key: {
                email: userData.email, // Partition key
                project: userData.project, // Sort key
            },
            UpdateExpression: 'SET firstName = :firstName, lastName = :lastName',
            ExpressionAttributeValues: {
                ':firstName': userUpdateData.firstName || existingUser.firstName,
                ':lastName': userUpdateData.lastName || existingUser.lastName,
            },
            ReturnValues: 'ALL_NEW',
        })
        if (userUpdated) {
            return buildResponse(HTTPCodes.SUCCESS, {message: 'User was successfully updated.'})
        } else {
            return failure({error: 'There was an error is updating the user.'})
        }
    } 
    catch (err) {
        console.log(err)
        return failure({error: err})
    }
}

export const main = verifyQueryParameters(['email', 'project'], updateUser)
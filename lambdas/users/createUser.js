import create from '../crud/createBase';
import get from '../crud/getBase';
import { respond, HTTPCodes, failure } from '../../libs/response-lib';
import { verifyBodyParameters } from '../../libs/api-helper-lib';

const prepare = (event) => {
    const data = JSON.parse(event.body);
    return {
        tableName: process.env.usersTableName,
        user: {
            userId: event.requestContext.identity.cognitoIdentityId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            projectId: data.projectId,
            attempts: {},
            createdAt: Date.now(),
        },
    };
}

const createUser = (event) => {
    var {tableName, user} = prepare(event);
    console.log(tableName)
    // Check if user exists
    return get({
        TableName: tableName,
        Key: {
            email: user.email,
            project: user.projectId,
        },
    }).then((existingUser) => {
        if (existingUser != undefined) {
            // User conflicts
            return respond(HTTPCodes.CONFLICT, {'error': 'An user for the specified porject already exists for the given email.'})
        }
        return create({
            TableName: tableName,
            Item: user
        })
    }).then((user) => {
        return respond(HTTPCodes.RESOURCE_CREATED, {user: user})
    }).catch((err) => {
        return new Promise((resolve) => resolve(failure({error: err})))
    })
}

export const main = verifyBodyParameters(['email', 'firstName', 'lastName', 'projectId'], createUser)
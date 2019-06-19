import create from '../crud/createBase';
import get from '../crud/getBase';
import { respond, HTTPCodes, failure, buildResponse } from '../../libs/response-lib';
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
            project: data.project,
            attempts: {},
            createdAt: Date.now(),
        },
    };
}

const createUserPromiseTest = (event) => {
    var {tableName, user} = prepare(event);
    // Check if user exists
    return get({
        TableName: tableName,
        Key: {
            email: user.email,
            project: user.project,
        },
    }).then((existingUser) => {
        if (existingUser != undefined) {
            // User already exists, deny request
            return respond(HTTPCodes.CONFLICT, {'error': 'An user for the specified project already exists for the given email.'})
        }
        create({
            TableName: tableName,
            Item: user
        }).then((createdUser) =>  respond(HTTPCodes.RESOURCE_CREATED, {user: createdUser}))
    }).catch((err) => new Promise((resolve) => resolve(failure({error: err}))))
}

const createUser = async (event) => {
    var {tableName, user} = prepare(event);
    try {
        var existingUser = await get({
            TableName: tableName,
            Key: {
                email: user.email,
                project: user.project,
            },
        });
        // User already exists, deny request
        if (existingUser != undefined) {
            return buildResponse(HTTPCodes.CONFLICT, {'error': 'An user for the specified project already exists for the given email.'});
        }

        var createdUser = await create({
            TableName: tableName,
            Item: user
        })
        return buildResponse(HTTPCodes.RESOURCE_CREATED, {user: createdUser});
    } 
    catch (err) {
        console.log(err)
        return failure({error: err})
    }
}

export const main = verifyBodyParameters(['email', 'firstName', 'lastName', 'project'], createUser)
import create from '../crud/create';
import { HTTPCodes, failure, buildResponse } from '../../libs/response-lib';
import { verifyBodyParamsExist } from '../../libs/api-helper-lib';

const prepare = (event) => {
    const data = JSON.parse(event.body);
    return {
        tableName: process.env.usersTableName,
        user: {
            userId: event.requestContext.identity.cognitoIdentityId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            createdAt: Date.now(),
        },
    };
};

const createUser = async (event) => {
    const { tableName, user } = prepare(event);
    try {
        const createdUser = await create({
            TableName: tableName,
            Item: user,
            ConditionExpression: 'attribute_not_exists(email) AND attribute_not_exists(projectId)',
        });
        return buildResponse(HTTPCodes.RESOURCE_CREATED, {
            user: createdUser,
        });
    } catch (err) {
        // The only condition on the create request is to check whether a user already exists.
        if (err.code === 'ConditionalCheckFailedException') {
            return buildResponse(HTTPCodes.CONFLICT, {
                error: 'An user for the specified project already exists for the given email.',
            });
        }
        return failure({
            error: err,
        });
    }
};

export const main = verifyBodyParamsExist(['email', 'firstName', 'lastName'], createUser);

import get from '../crud/get';
import _delete from '../crud/delete';
import {
    HTTPCodes,
    failure,
    buildResponse,
    errorBody,
    dataBody,
} from '../../libs/response-lib';
import {
    verifyQueryParamsExist,
} from '../../libs/api-helper-lib';

const prepare = (event) => {
    return {
        challengesTable: process.env.challengesTableName,
        adminTable: process.env.projectAdminTableName,
        challengeKey: {
            challengeId: event.pathParameters.challengeId,
            projectId: event.queryStringParameters.projectId,
        },
        adminKey: {
            userId: event.requestContext.identity.cognitoIdentityId,
            projectId: event.queryStringParameters.projectId,
        },
    };
};

const deleteChallenge = async (event) => {
    const {
        challengesTable,
        adminTable,
        challengeKey,
        adminKey,
    } = prepare(event);
    try {
        // User needs to be admin to delete challenge.
        const userAdmin = await get({
            TableName: adminTable,
            Key: adminKey,
        });
        if (userAdmin.Item === undefined) {
            return buildResponse(HTTPCodes.UNAUTHORIZED, errorBody('Not authorized to access this challenge'));
        }
        const deleteSuccess = await _delete({
            TableName: challengesTable,
            Key: challengeKey,
        });
        if (deleteSuccess) {
            return buildResponse(HTTPCodes.SUCCESS, dataBody({
                message: 'Challenge is successfully deleted.',
            }));
        } else {
            return failure('Failed to delete the challenges.');
        }
    } catch (err) {
        return failure(err);
    }
};

export const main = verifyQueryParamsExist(
    ['projectId'],
    deleteChallenge,
);

import get from '../crud/get';
import _delete from '../crud/delete';
import { failure, success, unauthorized } from '../../libs/response-lib';
import { verifyQueryParamsExist } from '../../libs/api-helper-lib';

const prepare = event => ({
    challengesTableName: process.env.challengesTableName,
    adminTable: process.env.projectAdminTableName,
    challengeKey: {
        challengeId: event.pathParameters.id,
        projectId: event.queryStringParameters.projectId,
    },
    adminKey: {
        userId: event.requestContext.identity.cognitoIdentityId,
        projectId: event.queryStringParameters.projectId,
    },
});

const deleteChallenge = async (event) => {
    const {
        challengesTableName, adminTable, challengeKey, adminKey,
    } = prepare(event);
    try {
        // User needs to be admin to delete challenge.
        const userAdmin = await get({
            TableName: adminTable,
            Key: adminKey,
        });
        if (userAdmin.Item === undefined) {
            return unauthorized('Not authorized to access this challenge');
        }
        await _delete({
            TableName: challengesTableName,
            Key: challengeKey,
        });
        return success({ message: 'Challenge is successfully deleted.' });
    } catch (err) {
        console.log(err, err.stack);
        return failure(err.message);
    }
};

export const main = verifyQueryParamsExist(['projectId'], deleteChallenge);

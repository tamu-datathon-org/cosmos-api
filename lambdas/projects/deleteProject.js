import _delete from '../crud/delete';
import list from '../crud/list';
import { success, failure } from '../../libs/response-lib';
import batch from '../crud/batchWrite';

const project = event => ({
    TableName: process.env.projectsTableName,
    Key: {
        projectId: event.pathParameters.id,
    },
});

const projectAdmin = event => ({
    TableName: process.env.projectAdminTableName,
    KeyConditionExpression: 'projectId = :projectId',
    ExpressionAttributeValues: {
        ':projectId': event.pathParameters.id,
    },
});

const projectChallenges = event => ({
    TableName: process.env.challengesTableName,
    KeyConditionExpression: 'projectId = :projectId',
    ExpressionAttributeValues: {
        ':projectId': event.pathParameters.id,
    },
});

const projectAdminDelete = admins => ({
    RequestItems: {
        [process.env.projectAdminTableName]: admins.map(admin => ({
            DeleteRequest: {
                Key: admin,
            },
        })),
    },
});

const projectChallengesDelete = challenges => ({
    RequestItems: {
        [process.env.challengesTableName]: challenges.map(challenge => ({
            DeleteRequest: {
                Key: {
                    projectId: challenge.projectId,
                    challengeId: challenge.challengeId,
                },
            },
        })),
    },
});

// TODO: can not batch write more than 25. must break up if more than 25
// TODO: eventually should wrap in Transaction so all updates happen all or nothing
// TODO#17(josiahcoad): Add check that cognitoID of user is present in projectAdminTable
const deleteProject = async (event) => {
    try {
        await _delete(project(event));
        const admins = await list(projectAdmin(event));
        if (admins.length > 0) {
            await batch(projectAdminDelete(admins));
        }
        const challenges = await list(projectChallenges(event));
        if (challenges.length > 0) {
            await batch(projectChallengesDelete(challenges));
        }
        return success({});
    } catch (err) {
        console.log(err, err.stack);
        return failure(err.message);
    }
};

export const main = deleteProject;

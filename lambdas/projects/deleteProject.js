import _delete from '../crud/delete';
import list from '../crud/list';
import { dataSuccess, failure } from '../../libs/response-lib';
import batch from '../crud/batchWrite';

const project = (event) => ({
    TableName: process.env.projectsTableName,
    Key: {
        projectId: event.pathParameters.projectId,
    },
});

const projectAdmin = (event) => ({
    TableName: process.env.projectAdminTableName,
    KeyConditionExpression: 'projectId = :projectId',
    ExpressionAttributeValues: {
        ':projectId': event.pathParameters.projectId,
    },
});

const projectAdminDelete = (admins) => ({
    RequestItems: {
        [process.env.projectAdminTableName]: admins.map((admin) => ({
            DeleteRequest: {
                Key: admin,
            },
        })),
    },
});

// TODO: can not batch write more than 25. must break up if more than 25
// TODO: eventually should wrap in Transaction so all updates happen all or nothing
export const main = (event) =>
    _delete(project(event))
        .then(() => list(projectAdmin(event)))
        .then((admins) => {
            // batch has to update between 1 and 25 items
            if (admins.length > 0) {
                return batch(projectAdminDelete(admins));
            }
            // this is what is returned in the case that batch succeeds
            return { UnprocessedItems: {} };
        })
        .then(dataSuccess)
        .catch(failure);

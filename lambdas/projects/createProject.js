import create from '../crud/create';
import { dataSuccess, failure, conflictFailure } from '../../libs/response-lib';
import { verifyBodyParamsExist } from '../../libs/api-helper-lib';

const project = (event) => {
    const { projectId, lessons } = JSON.parse(event.body);
    return {
        TableName: process.env.projectsTableName,
        Item: {
            projectId,
            lessons,
            createdAt: Date.now(),
        },
        ConditionExpression: 'attribute_not_exists(projectId)',
    };
};

const projectAdmin = (event) => {
    const { projectId } = JSON.parse(event.body);
    return {
        TableName: process.env.projectAdminTableName,
        Item: {
            projectId,
            userId: event.requestContext.identity.cognitoIdentityId,
        },
    };
};

const createProject = (event) =>
    create(projectAdmin(event))
        .then(() => create(project(event)))
        .then(dataSuccess)
        .catch(({ message, ...rest }) =>
            (message === 'The conditional request failed' ? conflictFailure() : failure({ message, ...rest })));

export const main = verifyBodyParamsExist(['projectId', 'lessons'], createProject);

import create from '../crud/create';
import { success, failure, conflict } from '../../libs/response-lib';
import { verifyBodyParamsExist } from '../../libs/api-helper-lib';

const project = (event) => {
    const { projectId, lessons, projectName, projectDescription } = JSON.parse(event.body);
    return {
        TableName: process.env.projectsTableName,
        Item: {
            projectId,
            lessons: lessons || [],
            projectName,
            projectDescription,
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

const createProject = event => create(projectAdmin(event))
    .then(() => create(project(event)))
    .then(success)
    .catch(({ message }) => (message === 'The conditional request failed'
        ? conflict()
        : failure(message)));

export const main = verifyBodyParamsExist(['projectId', 'projectName', 'projectDescription'], createProject);

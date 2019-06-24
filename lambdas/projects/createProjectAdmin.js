import create from '../crud/create';
import { dataSuccess, failure } from '../../libs/response-lib';

const projectAdmin = (event) => {
    const { projectId } = JSON.parse(event.body);
    return {
        TableName: process.env.projectsTableName,
        Item: {
            projectId,
            userId: event.requestContext.identity.cognitoIdentityId,
        },
    };
};

export const main = (event) =>
    create(projectAdmin(event))
        .then(dataSuccess)
        .catch(failure);

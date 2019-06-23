import create from '../crud/create';
import {
    success, failure, dataBody, errorBody, conflict,
} from '../../libs/response-lib';

const prepare = (event) => {
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

export const main = (event) =>
    create(prepare(event))
        .then((item) => success(dataBody(item)))
        .catch(({ message }) =>
            (message === 'The conditional request failed' ? conflict() : failure(errorBody(message))));

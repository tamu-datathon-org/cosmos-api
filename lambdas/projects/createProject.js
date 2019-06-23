import create from '../crud/create';
import {
    HTTPCodes, respond, success, failure,
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
        .then(success)
        .catch((body) =>
            (body.errors[0] === 'The conditional request failed'
                ? respond(HTTPCodes.CONFLICT, {
                    data: {},
                    errors: ['The object you tried to create already exists'],
                })
                : failure(body)));

import create from '../crud/create';

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

export const main = (event) => create(prepare(event));

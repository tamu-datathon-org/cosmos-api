import update from '../crud/update';

export const updateProjectLessons = (projectKey, lessons) => (
    update({
        TableName: process.env.projectsTableName,
        Key: projectKey,
        UpdateExpression:
            'SET lessons = :lessons',
        ExpressionAttributeValues: {
            ':lessons': lessons,
        },
        ReturnValues: 'ALL_NEW',
    })
);

export const projectChallenges = projectId => ({
    TableName: process.env.challengesTableName,
    KeyConditionExpression: 'projectId = :projectId',
    ExpressionAttributeValues: {
        ':projectId': projectId,
    },
});

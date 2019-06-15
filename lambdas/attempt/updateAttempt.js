import update from '../crud/update';

const prepare = (event) => {
    const data = JSON.parse(event.body);
    return {
        TableName: process.env.attemptsTableName,
        // 'Key' defines the partition key and sort key of the item to be updated
        // - 'userId': Identity Pool identity id of the authenticated user
        // - 'projectId': path parameter
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            attemptId: event.pathParameters.id,
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: 'SET answer = :answer',
        ExpressionAttributeValues: {
            ':answer': data.answer || null,
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect the result to see how it works with different settings
        ReturnValues: 'ALL_NEW',
    };
};

export const main = (event) => update(prepare(event));

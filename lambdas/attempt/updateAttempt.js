import update from '../crud/update';

const prepare = (event) =>
    new Promise((resolve) => {
        const data = JSON.parse(event.body);
        const params = {
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
            UpdateExpression: 'SET content = :content, attachment = :attachment',
            ExpressionAttributeValues: {
                ':attachment': data.attachment || null,
                ':content': data.content || null,
            },
            // 'ReturnValues' specifies if and how to return the item's attributes,
            // where ALL_NEW returns all attributes of the item after the update; you
            // can inspect 'result' below to see how it works with different settings
            ReturnValues: 'ALL_NEW',
        };
        resolve(params);
    });

export const main = (event) =>
    new Promise((resolve) =>
        prepare(event)
            .then(update)
            .then(resolve)
    );

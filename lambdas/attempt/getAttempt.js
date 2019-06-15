import get from '../crud/get';

export const main = (event) =>
    get({
        TableName: process.env.attemptsTableName,
        // 'Key' defines the partition key and sort key of the item to be retrieved
        // - 'userId': Identity Pool identity id of the authenticated user
        // - 'eventd': path parameter
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            attemptId: event.pathParameters.id,
        },
    });

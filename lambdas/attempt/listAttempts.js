import list from '../crud/list';

const prepare = (event) =>
    new Promise((resolve) => {
        const params = {
            TableName: process.env.attemptsTableName,
            // 'KeyConditionExpression' defines the condition for the query
            // - 'userId = :userId': only return items with matching 'userId'
            //   partition key
            // 'ExpressionAttributeValues' defines the value in the condition
            // - ':userId': defines 'userId' to be Identity Pool identity id
            //   of the authenticated user
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': event.requestContext.identity.cognitoIdentityId,
            },
        };
        resolve(params);
    });

export const main = (event) =>
    new Promise((resolve) =>
        prepare(event)
            .then(list)
            .then(resolve)
    );
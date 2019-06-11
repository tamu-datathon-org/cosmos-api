import uuid from 'uuid';
import * as dynamoDbLib from '../../libs/dynamodb-lib';
import { success, failure } from '../../libs/response-lib';

export async function main(event, context) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: 'cosmos-attempts',
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            attemptId: uuid.v1(),
            project: data.project,
            lesson: data.lesson,
            challenge: data.challenge,
            answer: data.answer,
            createdAt: Date.now(),
        },
    };
    try {
        await dynamoDbLib.call('put', params);
        return success(params.Item);
    } catch (e) {
        // console.log(e.message);
        return failure({ status: false });
    }
}

import uuid from 'uuid';
import create from '../crud/create';

const prepare = (event) => {
    const data = JSON.parse(event.body);
    return {
        TableName: process.env.attemptsTableName,
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
};

export const main = (event) => create(prepare(event));

import uuid from 'uuid';
import create from '../crud/create';

const prepare = (event) =>
    new Promise((resolve) => {
        const data = JSON.parse(event.body);
        const params = {
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
        resolve(params);
    });

export const main = (event) =>
    new Promise((resolve) =>
        prepare(event)
            .then(create)
            .then(resolve)
    );

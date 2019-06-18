import createAttempt from '../lambdas/attempt/createAttempt';
import getProject from '../projects/lambdas/get';
import graderMap from './graderUtils';
import { failure } from '../../libs/response-lib';

const prepareProject = (event) => {
    const data = JSON.parse(event.body);
    return {
        ProjectsTableName: process.env.projectsTableName,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            project: data.project,
        },
    };
};

const prepareAttempt = (event, passed) => {
    const data = JSON.parse(event.body);
    return {
        AttemptsTableName: process.env.attemptsTableName,
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            attemptId: uuid.v1(),
            project: data.project,
            lesson: data.lesson,
            challenge: data.challenge,
            answer: data.answer,
            createdAt: Date.now(),
            passed,
        },
    };
};

// should return only one item... but how to be sure?
const getChallenge = ({ lessonName, challengeName }, project) => {
    const lesson = project.lessons.filter((x) => x['lesson'] === lessonName);
    if (!lesson) throw 'lesson not found';
    const challenge = lesson[0].challenges.filter(
        (x) => x['challenge'] === challengeName
    );
    if (!challenge) throw 'challenge not found';
    return challenge[0];
};

export const main = (event) =>
    getProject(prepareProject(event))
        // try to find a challenge in thier
        .then((response) => {
            if (response.statusCode !== 200) throw response;
            return getChallenge(event, response.body.project);
        })
        // grade attempt and see if it passes
        .then(
            ({ passingCriteria, passingScore }) =>
                graderMap[passingCriteria](challenge.answer, response.body.answer) >=
                passingScore
        )
        // create an attempt for the user along with if they passed
        .then((passed) => createAttempt(prepareAttempt(event, passed)))
        .catch((err) => {
            console.log(err.message);
            resolve(failure({ status: false }));
        });

import AWS from 'aws-sdk';
import { main as createChallenge } from '../lambdas/challenges/createChallenge';
import { main as getChallenge } from '../lambdas/challenges/getChallenge';
import { main as getLesson } from '../lambdas/lessons/getLesson';
import { main as createLesson } from '../lambdas/lessons/createLesson';
import { main as deleteLesson } from '../lambdas/lessons/deleteLesson';
import { HTTPCodes } from '../libs/response-lib';
import 'jest-extended';

AWS.config.update({
    region: 'us-east-1',
});

const lessonObject = {
    lessonId: 'jest_test_lesson',
    name: 'Jest Test Lesson',
    image:
        'https://drive.google.com/uc?export=download&id=10_FqwgamTQcvn6ACSHSA3uPaSyzPvsRv',
    link:
        'https://research.google.com/seedbank/seed/lab__loading_and_understanding_your_data',
    linkText: 'View on Colab',
    description:
        'Use Pandas to load and explore the raw data and put together '
        + 'all the pieces needed to train a linear regression model in TensorFlow.',
};

const challenges = [
    {
        challengeId: 'jest_challenge_112358',
        projectId: 'jest_project_1234',
        lessonId: 'jest_test_lesson',
        challengeName: 'Jest Challenge Base',
        points: 1234,
        passingThreshold: 0.94,
        metric: 'accuracy',
        solution: [1, 10, 100, 100.0, 111.111],
        createdAt: expect.stringMatching(/\d{13}/),
    },
    {
        challengeId: 'jest_challenge_314159',
        projectId: 'jest_project_1234',
        lessonId: 'jest_test_lesson',
        challengeName: 'Jest Challenge Base 2',
        points: 1111,
        passingThreshold: 0.50,
        metric: 'f1',
        solution: [1, 2, 3, 4.56, 7.89, 101112],
        createdAt: expect.stringMatching(/\d{13}/),
    },
];

const safeChallenges = [
    {
        challengeId: 'jest_challenge_112358',
        projectId: 'jest_project_1234',
        lessonId: 'jest_test_lesson',
        challengeName: 'Jest Challenge Base',
        points: 1234,
        passingThreshold: 0.94,
        metric: 'accuracy',
        createdAt: expect.stringMatching(/\d{13}/),
    },
    {
        challengeId: 'jest_challenge_314159',
        projectId: 'jest_project_1234',
        lessonId: 'jest_test_lesson',
        challengeName: 'Jest Challenge Base 2',
        points: 1111,
        passingThreshold: 0.50,
        metric: 'f1',
        createdAt: expect.stringMatching(/\d{13}/),
    },
];

const authAddOn = {
    requestContext: {
        identity: {
            cognitoIdentityId: 'jest-test-admin-1234',
        },
    },
};

const incorrectAuthAddOn = {
    requestContext: {
        identity: {
            cognitoIdentityId: 'jest-incorrect-admin-1234',
        },
    },
};

// REQUESTS

const createChallengeRequest = index => ({
    body: JSON.stringify(challenges[index]),
    ...authAddOn,
});

const getChallengeRequest = index => ({
    pathParameters: {
        challengeId: challenges[index].challengeId,
    },
    queryStringParameters: {
        projectId: challenges[index].projectId,
    },
    ...authAddOn,
});

const createLessonRequest = {
    body: JSON.stringify({
        ...lessonObject,
        projectId: 'jest_project_1234',
    }),
    ...authAddOn,
};

const getLessonRequest = {
    pathParameters: {
        lessonId: lessonObject.lessonId,
    },
    queryStringParameters: {
        projectId: 'jest_project_1234',
    },
};

const deleteLessonRequest = {
    pathParameters: {
        lessonId: lessonObject.lessonId,
    },
    queryStringParameters: {
        projectId: 'jest_project_1234',
    },
    ...authAddOn,
};

const parseResponseBody = (response) => {
    const { body, ...rest } = response;
    return {
        ...rest,
        body: JSON.parse(body),
    };
};

// ---------- TEST SETUP ---------------

// Delete the test project before tests start.
beforeEach(async () => {
    // delete lesson in case it exists. Nothing to expect
    await deleteLesson(deleteLessonRequest)
        .then(response => expect(response.statusCode).toEqual(HTTPCodes.SUCCESS));
    // try get lesson as normal user and expect to fail because doesn't exist
    await getLesson({
        ...getLessonRequest,
        ...incorrectAuthAddOn,
    }).then(response => expect(response.statusCode).toEqual(HTTPCodes.NOT_FOUND));

    // Try to create lesson with correct auth and expect it to succeed.
    await createLesson(createLessonRequest)
        .then(response => expect(response.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED));
});

// ------- TESTS ---------

test('Lessons: Get Lesson Auth & No Auth', async () => {
    // Get lesson as admin and expect no challenges with it.
    await getLesson({
        ...getLessonRequest,
        ...authAddOn,
    }).then((response) => {
        expect(response.statusCode).toEqual(HTTPCodes.SUCCESS);
        expect(parseResponseBody(response).body.data.lesson).toEqual({
            ...lessonObject,
            createdAt: expect.stringMatching(/\d{13}/),
        });
    });
    // Get lesson as normal user and expect no challenges with it.
    await getLesson({
        ...getLessonRequest,
        ...incorrectAuthAddOn,
    }).then((response) => {
        expect(response.statusCode).toEqual(HTTPCodes.SUCCESS);
        expect(parseResponseBody(response).body.data.lesson).toEqual({
            ...lessonObject,
            createdAt: expect.stringMatching(/\d{13}/),
        });
    });
});

test('Lessons: Create Challenges & Get Lesson', async () => {
    // Get lesson as admin and expect no challenges with it.
    await getLesson({
        ...getLessonRequest,
        ...authAddOn,
    }).then((response) => {
        expect(response.statusCode).toEqual(HTTPCodes.SUCCESS);
        expect(parseResponseBody(response).body.data.lesson).toEqual({
            ...lessonObject,
            createdAt: expect.stringMatching(/\d{13}/),
        });
    });
    // Create two challenges.
    await createChallenge(createChallengeRequest(0))
        .then(response => expect(response.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED));
    await createChallenge(createChallengeRequest(1))
        .then(response => expect(response.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED));
    // Get lesson as admin and expect both challenges with it.
    await getLesson({
        ...getLessonRequest,
        ...authAddOn,
    }).then((response) => {
        expect(response.statusCode).toEqual(HTTPCodes.SUCCESS);
        expect(parseResponseBody(response).body.data.lesson).toEqual({
            ...lessonObject,
            createdAt: expect.stringMatching(/\d{13}/),
        });
        expect(parseResponseBody(response).body.data.challenges).toIncludeSameMembers(challenges);
    });
    // Get lesson as normal user and expect both challenges with it.
    await getLesson({
        ...getLessonRequest,
        ...incorrectAuthAddOn,
    }).then((response) => {
        expect(response.statusCode).toEqual(HTTPCodes.SUCCESS);
        expect(parseResponseBody(response).body.data.lesson).toEqual({
            ...lessonObject,
            createdAt: expect.stringMatching(/\d{13}/),
        });
        expect(parseResponseBody(response).body.data.challenges)
            .toIncludeSameMembers(safeChallenges);
    });
});

test('Lessons: Create Challenges & Delete Lesson', async () => {
    // Get lesson as admin and expect no challenges with it.
    await getLesson({
        ...getLessonRequest,
        ...authAddOn,
    }).then((response) => {
        expect(response.statusCode).toEqual(HTTPCodes.SUCCESS);
        expect(parseResponseBody(response).body.data.lesson).toEqual({
            ...lessonObject,
            createdAt: expect.stringMatching(/\d{13}/),
        });
    });
    // Create two challenges.
    await createChallenge(createChallengeRequest(0))
        .then(response => expect(response.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED));
    await createChallenge(createChallengeRequest(1))
        .then(response => expect(response.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED));
    // Get lesson as admin and expect both challenges with it.
    await getLesson({
        ...getLessonRequest,
        ...authAddOn,
    }).then((response) => {
        expect(response.statusCode).toEqual(HTTPCodes.SUCCESS);
        expect(parseResponseBody(response).body.data.lesson).toEqual({
            ...lessonObject,
            createdAt: expect.stringMatching(/\d{13}/),
        });
        expect(parseResponseBody(response).body.data.challenges).toIncludeSameMembers(challenges);
    });
    // Delete lesson and expect challenges to be deleted as well.
    await deleteLesson(deleteLessonRequest)
        .then(response => expect(response.statusCode).toEqual(HTTPCodes.SUCCESS));
    await getLesson({
        ...getLessonRequest,
        ...authAddOn,
    }).then(response => expect(response.statusCode).toEqual(HTTPCodes.NOT_FOUND));
    await getChallenge(getChallengeRequest(0))
        .then(response => expect(response.statusCode).toEqual(HTTPCodes.NOT_FOUND));
    await getChallenge(getChallengeRequest(1))
        .then(response => expect(response.statusCode).toEqual(HTTPCodes.NOT_FOUND));
});

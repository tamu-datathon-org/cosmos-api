import AWS from 'aws-sdk';
import { main as deleteChallenge } from '../lambdas/challenges/deleteChallenge';
import { main as createChallenge } from '../lambdas/challenges/createChallenge';
import { main as getChallenge } from '../lambdas/challenges/getChallenge';
import { main as updateChallenge } from '../lambdas/challenges/updateChallenge';
import { HTTPCodes } from '../libs/response-lib';

AWS.config.update({
    region: 'us-east-1',
});

const baseChallengeObject = {
    challengeId: 'test_challenge_112358',
    projectId: 'test_project_1234',
    lessonId: 'jest_lesson_1234',
    challengeName: 'Test Challenge Base',
    points: 1234,
    passingThreshold: 0.94,
    metric: 'accuracy',
    solution: [1, 10, 100, 100.0, 111.111],
    createdAt: expect.stringMatching(/\d{13}/),
};

const unsupportedMetricChallengeObject = {
    challengeId: 'unsupported_challenge_1234',
    projectId: 'test_project_1234',
    lessonId: 'jest_lesson_1234',
    challengeName: '',
    points: 0,
    passingThreshold: 0,
    metric: 'unsupported_metric',
    solution: [],
    createdAt: expect.stringMatching(/\d{13}/),
};

const safeBaseChallengeObject = {
    challengeId: 'test_challenge_112358',
    projectId: 'test_project_1234',
    lessonId: 'jest_lesson_1234',
    challengeName: 'Test Challenge Base',
    passingThreshold: 0.94,
    points: 1234,
    metric: 'accuracy',
    createdAt: expect.stringMatching(/\d{13}/),
};

const challengeUpdateObject = {
    challengeId: 'test_challenge_112358',
    projectId: 'test_project_1234',
    lessonId: 'jest_lesson_1234',
    challengeName: 'Test Challenge Updated',
    points: 5678,
    passingThreshold: 1.0,
    metric: 'accuracy',
    solution: [1.0, 11.1, 123.45, 314.59],
    createdAt: expect.stringMatching(/\d{13}/),
};

// REQUESTS

const challengeRequest = {
    pathParameters: {
        id: 'test_challenge_112358',
    },
    queryStringParameters: {
        projectId: 'test_project_1234',
    },
};

const createChallengeRequest = {
    body: JSON.stringify(baseChallengeObject),
};

const unsupportedMetricCreateChallengeRequest = {
    body: JSON.stringify(unsupportedMetricChallengeObject),
};

const updateChallengeRequest = {
    body: JSON.stringify(challengeUpdateObject),
    ...challengeRequest,
};

const authAddOn = {
    requestContext: {
        identity: {
            cognitoIdentityId: 'test_admin_12345',
        },
    },
};

const incorrectAuthAddOn = {
    requestContext: {
        identity: {
            cognitoIdentityId: 'incorrect_test_admin',
        },
    },
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
    // delete challenge in case it exists. Nothing to expect
    await deleteChallenge({
        ...challengeRequest,
        ...authAddOn,
    });
    // try get project as normal user and expect to fail because doesn't exist
    const getResponse = await getChallenge({
        ...challengeRequest,
        ...incorrectAuthAddOn,
    });
    expect(getResponse.statusCode).toEqual(HTTPCodes.NOT_FOUND);

    // Try to create challenge with correct auth and expect it to succeed.
    const authCreateChallenge = await createChallenge({
        ...createChallengeRequest,
        ...authAddOn,
    });
    expect(authCreateChallenge.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED);
});

// ------- TESTS ---------

test('Challenges: Create Challenge - Auth & No Auth', async () => {
    // Delete challenge from setup.
    const authDeleteResponse = await deleteChallenge({
        ...challengeRequest,
        ...authAddOn,
    });
    expect(authDeleteResponse.statusCode).toEqual(HTTPCodes.SUCCESS);

    // Try to create challenge with incorrect auth and expect it to fail.
    const incorrectAuthCreateChallenge = await createChallenge({
        ...createChallengeRequest,
        ...incorrectAuthAddOn,
    });
    expect(incorrectAuthCreateChallenge.statusCode).toEqual(HTTPCodes.UNAUTHORIZED);
    // Try to create challenge with correct auth and expect it to succeed.
    const authCreateChallenge = await createChallenge({
        ...createChallengeRequest,
        ...authAddOn,
    });
    expect(authCreateChallenge.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED);
    // Delete created challenge with incorrect auth, expect failure.
    const incorrectAuthDeleteResponse = await deleteChallenge({
        ...challengeRequest,
        ...incorrectAuthAddOn,
    });
    expect(incorrectAuthDeleteResponse.statusCode).toEqual(HTTPCodes.UNAUTHORIZED);
});

test('Challenges: Update Challenge - Auth & No Auth', async () => {
    // Get with auth, expect full challenge.
    const authGetChallenge = await getChallenge({
        ...challengeRequest,
        ...authAddOn,
    });
    expect(authGetChallenge.statusCode).toEqual(HTTPCodes.SUCCESS);
    const getChallengeData = parseResponseBody(authGetChallenge).body.data;
    expect(getChallengeData).toEqual(baseChallengeObject);

    // Update challenge with correct auth, expect success.
    const updatedChallenge = await updateChallenge({
        ...updateChallengeRequest,
        ...authAddOn,
    });
    expect(updatedChallenge.statusCode).toEqual(HTTPCodes.SUCCESS);

    // Get challenge with correct auth, expect updated challenge;
    const authGetUpdatedChallenge = await getChallenge({
        ...challengeRequest,
        ...authAddOn,
    });
    expect(authGetUpdatedChallenge.statusCode).toEqual(HTTPCodes.SUCCESS);
    const updatedGetChallengeData = parseResponseBody(authGetUpdatedChallenge).body.data;
    expect(updatedGetChallengeData).toEqual(challengeUpdateObject);
});

test('Challenges: Delete Challenge - Auth & No Auth', async () => {
    // Delete challenge without auth, expect unauthorized.
    const noAuthDeleteResponse = await deleteChallenge({
        ...challengeRequest,
        ...incorrectAuthAddOn,
    });
    expect(noAuthDeleteResponse.statusCode).toEqual(HTTPCodes.UNAUTHORIZED);

    // Delete challenge with auth, expect success.
    const authDeleteResponse = await deleteChallenge({
        ...challengeRequest,
        ...authAddOn,
    });
    expect(authDeleteResponse.statusCode).toEqual(HTTPCodes.SUCCESS);
});

test('Challenges: Get Challenge - Auth & No Auth', async () => {
    // Get challenge with incorrect auth, expect safe challenge;
    const noAuthGetChallenge = await getChallenge({
        ...challengeRequest,
        ...incorrectAuthAddOn,
    });
    expect(noAuthGetChallenge.statusCode).toEqual(HTTPCodes.SUCCESS);
    const noAuthChallengeData = parseResponseBody(noAuthGetChallenge).body.data;
    expect(noAuthChallengeData).toEqual(safeBaseChallengeObject);

    // Get challenge with correct auth, expect full challenge;
    const authGetChallenge = await getChallenge({
        ...challengeRequest,
        ...authAddOn,
    });
    expect(authGetChallenge.statusCode).toEqual(HTTPCodes.SUCCESS);
    const authChallengeData = parseResponseBody(authGetChallenge).body.data;
    expect(authChallengeData).toEqual(baseChallengeObject);
});

test('Challenges: Unsupported Metric Challenge', async () => {
    // Try to create challenge with correct auth and expect it to succeed.
    await createChallenge({
        ...unsupportedMetricCreateChallengeRequest,
        ...authAddOn,
    }).then(response => expect(response.statusCode).toEqual(HTTPCodes.BAD_REQUEST));
});

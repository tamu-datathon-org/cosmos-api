import AWS from 'aws-sdk';
import { main as createUser } from '../lambdas/users/createUser';
import { main as deleteUser } from '../lambdas/users/deleteUser';
import { main as createChallenge } from '../lambdas/challenges/createChallenge';
import { main as deleteChallenge } from '../lambdas/challenges/deleteChallenge';
import { main as judgeAttempt } from '../lambdas/judge/judgeAttempt';
import { main as scoreChallenge } from '../lambdas/score/scoreChallenge';
import { HTTPCodes } from '../libs/response-lib';

AWS.config.update({
    region: 'us-east-1',
});

const accuracyChallengeObject = {
    challengeId: 'score_test_challenge_112358',
    projectId: 'test_project_1234',
    lessonId: 'jest_score_lesson_1234',
    challengeName: 'Test Challenge Base',
    points: 1234,
    passingThreshold: 0.94,
    metric: 'accuracy',
    solution: [1, 10, 100, 100.0, 111.111],
    createdAt: expect.stringMatching(/\d{13}/),
};

const accuracyScoreResponse = {
    passed: true,
    points: 1234,
    numAttempts: 2,
};

const passingAttemptObject = {
    email: 'score_test_user@gmail.com',
    challengeId: 'score_test_challenge_112358',
    projectId: 'test_project_1234',
    solution: [1, 10, 100, 100.0, 111.111],
};

const passingAttemptRequest = {
    body: JSON.stringify(passingAttemptObject),
};

const failingAttemptObject = {
    email: 'score_test_user@gmail.com',
    challengeId: 'score_test_challenge_112358',
    projectId: 'test_project_1234',
    solution: [1, 2, 3, 100.0, 111.111],
};

const failingAttemptRequest = {
    body: JSON.stringify(failingAttemptObject),
};

const testUser = {
    email: 'score_test_user@gmail.com',
    firstName: 'Scorey',
    lastName: 'McScoreFace',
};

const createTestUserRequest = {
    body: JSON.stringify(testUser),
    requestContext: {
        identity: {
            cognitoIdentityId: 'SCORE-TEST-USER-1234',
        },
    },
};

const deleteUserRequest = {
    queryStringParameters: {
        email: 'score_test_user@gmail.com',
    },
    requestContext: {
        identity: {
            cognitoIdentityId: 'SCORE-TEST-USER-1234',
        },
    },
};

const createChallengeRequest = {
    body: JSON.stringify(accuracyChallengeObject),
    requestContext: {
        identity: {
            cognitoIdentityId: 'test_admin_12345',
        },
    },
};

const deleteChallengeRequest = {
    requestContext: {
        identity: {
            cognitoIdentityId: 'test_admin_12345',
        },
    },
    pathParameters: {
        id: 'score_test_challenge_112358',
    },
    queryStringParameters: {
        projectId: 'test_project_1234',
    },
};

// ---------- TEST REQUESTS ------------
const scoreChallengeRequest = {
    queryStringParameters: {
        projectId: 'test_project_1234',
        email: 'score_test_user@gmail.com',
    },
    pathParameters: {
        id: 'score_test_challenge_112358',
    },
    requestContext: {
        identity: {
            cognitoIdentityId: 'SCORE-TEST-USER-1234',
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

// Make sure test user and challenge exist before all tests start.
beforeAll(async () => {
    // Delete created test user.
    deleteUser(deleteUserRequest);
    // Delete created test challenge.
    await deleteChallenge(deleteChallengeRequest);

    // Create user to post solutions from.
    await createUser(createTestUserRequest);
    // Create challenge to post solutions for.
    await createChallenge(createChallengeRequest);

    // Create attempts for users.
    const passingAttemptResp = await judgeAttempt(passingAttemptRequest);
    expect(passingAttemptResp.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED);
    const failingAttemptResp = await judgeAttempt(failingAttemptRequest);
    expect(failingAttemptResp.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED);
});

// Delete the created test user and challenge after all tests end.
afterAll(async () => {
    // Delete created test user.
    const userResponse = deleteUser(deleteUserRequest);
    expect(userResponse.statusCode).toEqual(HTTPCodes.SUCCESS);
    // Delete created test challenge.
    const challengeResponse = await deleteChallenge(deleteChallengeRequest);
    expect(challengeResponse.statusCode).toEqual(HTTPCodes.SUCCESS);
});

// --------------- TESTS -------------------

// We added a passing & failing attempt, so the score request should pass.
test('Score: Score Challenge', async () => {
    scoreChallenge(scoreChallengeRequest)
        .then((response) => {
            expect(response.statusCode).toEqual(HTTPCodes.SUCCESS);
            const { body: scoreBody } = parseResponseBody(response);
            const { solution, ...challenge } = accuracyChallengeObject;
            expect(scoreBody.data).toEqual({ challenge, ...accuracyScoreResponse });
        });
});

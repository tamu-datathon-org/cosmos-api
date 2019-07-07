import AWS from 'aws-sdk';
import {
    main as createUser,
} from '../lambdas/users/createUser';
import {
    main as deleteUser,
} from '../lambdas/users/deleteUser';
import {
    main as createChallenge,
} from '../lambdas/challenges/createChallenge';
import {
    main as deleteChallenge,
} from '../lambdas/challenges/deleteChallenge';
import {
    main as judgeAttempt,
} from '../lambdas/judge/judgeAttempt';
import {
    HTTPCodes,
} from '../libs/response-lib';

AWS.config.update({
    region: 'us-east-1',
});

const accuracyChallengeObject = {
    challengeId: 'judge_test_challenge_112358',
    projectId: 'test_project_1234',
    challengeName: 'Test Challenge Base',
    points: 1234,
    passingThreshold: 0.94,
    metric: 'accuracy',
    solution: [1, 10, 100, 100.0, 111.111],
};

const passingAttemptObject = {
    email: 'judge_test_user@gmail.com',
    challengeId: 'judge_test_challenge_112358',
    projectId: 'test_project_1234',
    solution: [1, 10, 100, 100.0, 111.111],
};

const passingAttemptRequest = {
    body: JSON.stringify(passingAttemptObject),
};

const failingAttemptObject = {
    email: 'judge_test_user@gmail.com',
    challengeId: 'judge_test_challenge_112358',
    projectId: 'test_project_1234',
    solution: [1, 2, 3, 100.0, 111.111],
};

const failingAttemptRequest = {
    body: JSON.stringify(failingAttemptObject),
};

const testUser = {
    email: 'judge_test_user@gmail.com',
    firstName: 'Judgy',
    lastName: 'McJudgeFace',
};

const createTestUserRequest = {
    body: JSON.stringify(testUser),
    requestContext: {
        identity: {
            cognitoIdentityId: 'JUDGE-TEST-USER-1234',
        },
    },
};

const deleteUserRequest = {
    queryStringParameters: {
        email: 'judge_test_user@gmail.com',
    },
    requestContext: {
        identity: {
            cognitoIdentityId: 'JUDGE-TEST-USER-1234',
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
        challengeId: 'judge_test_challenge_112358',
    },
    queryStringParameters: {
        projectId: 'test_project_1234',
    },
};

const parseResponseBody = (response) => {
    const {
        body,
        ...rest
    } = response;
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

test('Judge: Passing Attempt', async () => {
    const judgeAttemptResponse = await judgeAttempt(passingAttemptRequest);
    expect(judgeAttemptResponse.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED);
    const { body: judgeBody } = parseResponseBody(judgeAttemptResponse);
    expect(judgeBody.passed).toEqual(true);
    expect(judgeBody.points).toEqual(accuracyChallengeObject.points);
});

test('Judge: Failing Attempt', async () => {
    const judgeAttemptResponse = await judgeAttempt(failingAttemptRequest);
    expect(judgeAttemptResponse.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED);
    const { body: judgeBody } = parseResponseBody(judgeAttemptResponse);
    expect(judgeBody.passed).toEqual(false);
    expect(judgeBody.points).toEqual(0);
});
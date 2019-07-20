import AWS from 'aws-sdk';
import { main as deleteProject } from '../lambdas/projects/deleteProject';
import { main as createProject } from '../lambdas/projects/createProject';
import { main as getProject } from '../lambdas/projects/getProject';
import { main as createChallenge } from '../lambdas/challenges/createChallenge';
import { main as createLesson } from '../lambdas/lessons/createLesson';
import { conflictMsg, errorBody, HTTPCodes } from '../libs/response-lib';
import 'jest-extended';

AWS.config.update({ region: 'us-east-1' });

const projectItem = {
    projectId: 'tamu_datathon',
    projectName: 'TAMU Datathon',
    projectDescription: 'The first ever Datathon at Texas A&M University!',
    lessons: [],
};

const challenges = [
    {
        challengeName: 'Create a scatter plot for new features',
        challengeId: 'scatter_plot',
        projectId: 'tamu_datathon',
        lessonId: 'data_management',
        points: 1,
        metric: 'accuracy',
        passingThreshold: 99,
        solution: [1, 2, 3, 4],
        createdAt: expect.stringMatching(/\d{13}/),
    },
    {
        challengeName: 'Explain what you see:',
        challengeId: 'explain_answer',
        projectId: 'tamu_datathon',
        lessonId: 'data_management',
        points: 10,
        metric: 'f1_binary',
        passingThreshold: 90,
        solution: [1, 0, 1, 0],
        createdAt: expect.stringMatching(/\d{13}/),
    },
];

// REQUESTS
const createRequest = {
    body: JSON.stringify(projectItem),
    requestContext: {
        identity: {
            cognitoIdentityId: 'USER-SUB-1234',
        },
    },
};

const createLessonRequest = {
    body: JSON.stringify({
        lessonId: 'data_management',
        projectId: 'tamu_datathon',
        name: 'Data Management',
        image:
            'https://drive.google.com/uc?export=download&id=10_FqwgamTQcvn6ACSHSA3uPaSyzPvsRv',
        link:
            'https://research.google.com/seedbank/seed/lab__loading_and_understanding_your_data',
        linkText: 'View on Colab',
        description:
            'Use Pandas to load and explore the raw data and put together '
            + 'all the pieces needed to train a linear regression model in TensorFlow.',
    }),
    requestContext: {
        identity: {
            cognitoIdentityId: 'USER-SUB-1234',
        },
    },
};

const createChallengeRequest = (index, lessonId) => {
    challenges[index].lessonId = lessonId;
    return {
        body: JSON.stringify(challenges[index]),
        requestContext: {
            identity: {
                cognitoIdentityId: 'USER-SUB-1234',
            },
        },
    };
};

const getRequest = {
    pathParameters: {
        id: 'tamu_datathon',
    },
};

const deleteRequest = {
    pathParameters: {
        id: 'tamu_datathon',
    },
};

// RESPONSES
const deleteSucceedResponse = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: '{"data":{},"errors":[]}',
};

const createSucceedResponse = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: { data: { ...projectItem, createdAt: expect.stringMatching(/\d{13}/) }, errors: [] },
};

const createFailResponse = {
    statusCode: 409,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(errorBody(conflictMsg)),
};

const getFailResponse = {
    statusCode: 404,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(errorBody('A project with the specified ID could not be found')),
};

const getSucceedResponse = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: { data: { ...projectItem, createdAt: expect.stringMatching(/\d{13}/), challenges: [] }, errors: [] },
};

const parseResponseBody = (response) => {
    const { body, ...rest } = response;
    return { ...rest, body: JSON.parse(body) };
};

// Test Setup

beforeEach(async () => {
    await deleteProject(deleteRequest)
        .then(response => expect(response).toEqual(deleteSucceedResponse));
});

// Tests

test('Project: Get non-existent project', async () => {
    // Try get project and expect to fail because doesn't exist
    await getProject(getRequest)
        .then(response => expect(response).toEqual(getFailResponse));
});

test('Project: Create project', async () => {
    // Create project and expect to succeed
    await createProject(createRequest)
        .then(response => expect(parseResponseBody(response)).toMatchObject(createSucceedResponse));
});

test('Project: Create project twice', async () => {
    // Create project and expect to succeed
    await createProject(createRequest)
        .then(response => expect(parseResponseBody(response)).toMatchObject(createSucceedResponse));
    // Try to create project and expect to fail because already exists
    await createProject(createRequest)
        .then(response => expect(response).toEqual(createFailResponse));
});

test('Project: Create, Get', async () => {
    // Create project and expect to succeed
    await createProject(createRequest)
        .then(response => expect(parseResponseBody(response)).toMatchObject(createSucceedResponse));
    // Try get project and expect to succeed
    await getProject(getRequest)
        .then(response => expect(parseResponseBody(response)).toMatchObject(getSucceedResponse));
});

test('Project: Create, Add Challenges and Get', async () => {
    // Create project and expect to succeed
    await createProject(createRequest)
        .then(response => expect(parseResponseBody(response)).toMatchObject(createSucceedResponse));
    // Try get project and expect to succeed without any challenges
    await getProject(getRequest)
        .then(response => expect(parseResponseBody(response)).toMatchObject(getSucceedResponse));
    let lessonId;
    // Create lesson for the project.
    await createLesson(createLessonRequest)
        .then((response) => {
            expect(response.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED);
            ({ lessonId } = parseResponseBody(response).body.data);
        });
    // Add two challenges.
    await createChallenge(createChallengeRequest(0, lessonId))
        .then(response => expect(response.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED));
    await createChallenge(createChallengeRequest(1, lessonId))
        .then(response => expect(response.statusCode).toEqual(HTTPCodes.RESOURCE_CREATED));
    // try get project and expect to succeed with new challenges.
    await getProject(getRequest)
        .then(response => expect(parseResponseBody(response).body.data.challenges)
            .toIncludeSameMembers(challenges));
});

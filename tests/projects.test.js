import AWS from 'aws-sdk';
import { main as deleteProject } from '../lambdas/projects/deleteProject';
import { main as createProject } from '../lambdas/projects/createProject';
import { main as getProject } from '../lambdas/projects/getProject';
import { conflictMsg, notFoundMsg, errorBody } from '../libs/response-lib';

AWS.config.update({ region: 'us-east-1' });

// TODO(phulsechinmay): Add lessonIds to lessons and challenges once implemented
const projectItem = {
    projectId: 'tamu_datathon',
    projectName: 'TAMU Datathon',
    projectDescription: 'The first ever Datathon at Texas A&M University!',
    lessons: [
        {
            name: 'Data Management',
            image:
                'https://drive.google.com/uc?export=download&id=10_FqwgamTQcvn6ACSHSA3uPaSyzPvsRv',
            link:
                'https://research.google.com/seedbank/seed/lab__loading_and_understanding_your_data',
            linkText: 'View on Colab',
            description:
                'Use Pandas to load and explore the raw data and put together '
                + 'all the pieces needed to train a linear regression model in TensorFlow.',
        },
    ],
};

const challenges = [
    {
        challengeName: 'Create a scatter plot for new features',
        challengeId: 'scatter_plot',
        projectId: 'tamu_datathon',
        points: 1,
        gradingMetric: 'accuracy',
        passingThreshold: 99,
        solution: [1, 2, 3, 4],
    },
    {
        name: 'Explain what you see:',
        challengeId: 'explain_answer',
        projectId: 'tamu_datathon',
        points: 10,
        gradingMetric: 'f1',
        passingThreshold: 90,
        solution: [1, 0, 1, 0],
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

const createChallengeRequest = (index) => ({
    body: JSON.stringify(challenges[index]),
    requestContext: {
        identity: {
            cognitoIdentityId: 'USER-SUB-1234',
        },
    },
});

const getRequest = {
    pathParameters: {
        projectId: 'TAMU Datathon',
    },
};

const deleteRequest = {
    pathParameters: {
        projectId: 'TAMU Datathon',
    },
};

// RESPONSES
const deleteSucceedResponse = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: '{"data":{"UnprocessedItems":{}},"errors":[]}',
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
    body: JSON.stringify(errorBody(notFoundMsg)),
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
    const deleteResponse = await deleteProject(deleteRequest);
    expect(deleteResponse).toEqual(deleteSucceedResponse);
})

// Tests

test('Project: Get non-existent project', async () => {
    // try get project and expect to fail because doesn't exist
    await getProject(getRequest).then((response) => expect(response).toEqual(getFailResponse));
});

test('Project: Create project', async () => {
    // create project and expect to succeed
    await createProject(createRequest).then((response) =>
        expect(parseResponseBody(response)).toMatchObject(createSucceedResponse));
});

test('Project: Create project twice', async () => {
    // create project and expect to succeed
    await createProject(createRequest).then((response) =>
        expect(parseResponseBody(response)).toMatchObject(createSucceedResponse));
    // try to create project and expect to fail because already exists
    await createProject(createRequest).then((response) =>
        expect(response).toEqual(createFailResponse));
});

test('Project: Create, Get', async () => {
    // create project and expect to succeed
    await createProject(createRequest).then((response) =>
        expect(parseResponseBody(response)).toMatchObject(createSucceedResponse));
    // try get project and expect to succeed
    await getProject(getRequest).then((response) =>
        expect(parseResponseBody(response)).toMatchObject(getSucceedResponse));
});



/* eslint-disable no-undef */
import AWS from 'aws-sdk';
import { main as deleteProject } from '../lambdas/projects/deleteProject';
import { main as createProject } from '../lambdas/projects/createProject';
import { main as getProject } from '../lambdas/projects/getProject';
import { conflictBody, notFoundBody } from '../libs/response-lib';

AWS.config.update({ region: 'us-east-1' });

const projectItem = {
    projectId: 'TAMU Datathon',
    lessons: [
        {
            name: 'Data Management',
            image:
                'https://drive.google.com/uc?export=download&id=10_FqwgamTQcvn6ACSHSA3uPaSyzPvsRv',
            link:
                'https://research.google.com/seedbank/seed/lab__loading_and_understanding_your_data',
            linkText: 'View on Colab',
            description:
                'Use Pandas to load and explore the raw data and put together all the pieces needed to train a linear regression model in TensorFlow.',
            challenges: [
                {
                    name: 'Create a scatter plot for new features',
                    points: 1,
                    gradingMetric: 'accuracy',
                    passingThreshold: 99,
                    solution: [1, 2, 3, 4],
                },
                {
                    name: 'Explain what you see ',
                    points: 1,
                    gradingMetric: 'f1',
                    passingThreshold: 90,
                    solution: [1, 0, 1, 0],
                },
                {
                    name: 'Options to handle missing data',
                    points: 1,
                    gradingMetric: 'precision',
                    passingThreshold: 95,
                    solution: [1, 0, 1, 0],
                },
                {
                    name: 'Build a Linear Regression Model',
                    points: 1,
                    gradingMetric: 'MAP',
                    passingThreshold: 80,
                    solution: [1, 0, 1, 0],
                },
            ],
        },
    ],
};

// REQUESTS
const createRequest = {
    body: JSON.stringify(projectItem),
    requestContext: {
        identity: {
            cognitoIdentityId: 'USER-SUB-1234',
        },
    },
};

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
    body: JSON.stringify(conflictBody),
};

const getFailResponse = {
    statusCode: 404,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(notFoundBody),
};

const getSucceedResponse = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: { data: { ...projectItem, createdAt: expect.stringMatching(/\d{13}/) }, errors: [] },
};

const parseResponseBody = (response) => {
    const { body, ...rest } = response;
    return { ...rest, body: JSON.parse(body) };
};

test('Project: Delete, Get', async () => {
    // delete project in case it exists and expect to succeed
    await deleteProject(deleteRequest).then((response) =>
        expect(response).toEqual(deleteSucceedResponse));
    // try get project and expect to fail because doesn't exist
    await getProject(getRequest).then((response) => expect(response).toEqual(getFailResponse));
});

test('Project: Delete, Create', async () => {
    // delete project in case it exists and expect to succeed
    await deleteProject(deleteRequest).then((response) =>
        expect(response).toEqual(deleteSucceedResponse));
    // create project and expect to succeed
    await createProject(createRequest).then((response) =>
        expect(parseResponseBody(response)).toMatchObject(createSucceedResponse));
});

test('Project: Delete, Create, Create', async () => {
    // delete project in case it exists and expect to succeed
    await deleteProject(deleteRequest).then((response) =>
        expect(response).toEqual(deleteSucceedResponse));
    // create project and expect to succeed
    await createProject(createRequest).then((response) =>
        expect(parseResponseBody(response)).toMatchObject(createSucceedResponse));
    // try to create project and expect to fail because already exists
    await createProject(createRequest).then((response) =>
        expect(response).toEqual(createFailResponse));
});

test('Project: Delete, Create, Get', async () => {
    // delete project in case it exists and expect to succeed
    await deleteProject(deleteRequest).then((response) =>
        expect(response).toEqual(deleteSucceedResponse));
    // create project and expect to succeed
    await createProject(createRequest).then((response) =>
        expect(parseResponseBody(response)).toMatchObject(createSucceedResponse));
    // try get project and expect to succeed
    await getProject(getRequest).then((response) =>
        expect(parseResponseBody(response)).toMatchObject(getSucceedResponse));
});

// TODO: (when we have grader) assert that we have a grader for each challenge's metric

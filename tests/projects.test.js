/* eslint-disable no-undef */
import AWS from 'aws-sdk';
import { main as deleteProject } from '../lambdas/projects/deleteProject';
import { main as createProject } from '../lambdas/projects/createProject';
import { main as getProject } from '../lambdas/projects/getProject';
import { conflictBody } from '../libs/response-lib';

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
                'Create a scatter plot for new features',
                'Explain what you see ',
                'Options to handle missing data',
                'Build a Linear Regression Model',
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
    statusCode: 500,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: '{"data":{},"errors":[{"message":"Item not found."}]}',
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

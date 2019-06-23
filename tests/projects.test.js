/* eslint-disable no-undef */
import AWS from 'aws-sdk';
import { main as deleteProject } from '../lambdas/projects/deleteProject';
import { main as createProject } from '../lambdas/projects/createProject';
import { main as getProject } from '../lambdas/projects/getProject';

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
const createProjectRequest = {
    body: JSON.stringify(projectItem),
};

const getProjectRequest = {
    pathParameters: {
        projectId: 'TAMU Datathon',
    },
};

const deleteProjectRequest = {
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
    body: '{"data":{},"errors":["The object you tried to create already exists"]}',
};

const getFailResponse = {
    statusCode: 500,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: '{"data":{},"errors":["Item not found."]}',
};

const getSucceedResponse = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: { data: { ...projectItem, createdAt: expect.stringMatching(/\d{13}/) }, errors: [] },
};

// remove the 'createdAt' param from the response
const parseResponse = (response) => {
    const { body, ...rest } = response;
    return { ...rest, body: JSON.parse(body) };
};

test('createGetDeleteProject', (done) => {
    // delete project in case it exists and expect to succeed
    deleteProject(deleteProjectRequest)
        .then((response) => expect(response).toEqual(deleteSucceedResponse))
        // create project and expect to succeed
        .then(() => createProject(createProjectRequest))
        .then((response) => expect(parseResponse(response)).toMatchObject(createSucceedResponse))
        // try to create project and expect to fail because already exists
        .then(() => createProject(createProjectRequest))
        .then((response) => expect(response).toEqual(createFailResponse))
        // try get project and expect to succeed
        .then(() => getProject(getProjectRequest))
        .then((response) => expect(parseResponse(response)).toMatchObject(getSucceedResponse))
        // delete project and expect to succeed
        .then(() => deleteProject(deleteProjectRequest))
        .then((response) => expect(response).toEqual(deleteSucceedResponse))
        // try get project and expect to fail because doesn't exist
        .then(() => getProject(getProjectRequest))
        .then((response) => expect(response).toEqual(getFailResponse))
        .then(done);
});

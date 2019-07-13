import AWS from 'aws-sdk';
import { main as createProject } from '../lambdas/projects/createProject';

AWS.config.update({ region: 'us-east-1' });

const projectItem = {
    projectId: 'jest_project_1234',
    projectName: 'Jest Project',
    projectDescription: 'The first ever Jest Project!',
    lessons: [
        {
            lessonId: 'jest_default_lesson',
            name: 'Jest Default',
            image:
                'https://drive.google.com/uc?export=download&id=10_FqwgamTQcvn6ACSHSA3uPaSyzPvsRv',
            link:
                'https://research.google.com/seedbank/seed/lab__loading_and_understanding_your_data',
            linkText: 'View on Colab',
            description: 'The default Jest Lesson.',
        },
    ],
};

const createRequest = {
    body: JSON.stringify(projectItem),
    requestContext: {
        identity: {
            cognitoIdentityId: 'jest-test-admin-1234',
        },
    },
};

// Create default project for tests.
createProject(createRequest);

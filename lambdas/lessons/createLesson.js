import uuid from 'uuid';
import get from '../crud/get';
import {
    failure, conflict, unauthorized, resourceCreated, notFound,
} from '../../libs/response-lib';
import { verifyBodyParamsExist } from '../../libs/api-helper-lib';
import { updateProjectLessons } from './lessons-helper';

const prepare = (event) => {
    const data = JSON.parse(event.body);
    return {
        projectsTableName: process.env.projectsTableName,
        adminTable: process.env.projectAdminTableName,
        lesson: {
            lessonId: uuid.v4(),
            name: data.name,
            image: data.image,
            link: data.link,
            linkText: data.linkText,
            description: data.description,
            createdAt: Date.now(),
        },
        adminKey: {
            userId: event.requestContext.identity.cognitoIdentityId,
            projectId: data.projectId,
        },
        projectKey: {
            projectId: data.projectId,
        },
    };
};

const createLesson = async (event) => {
    const {
        projectsTableName, adminTable, lesson, adminKey, projectKey,
    } = prepare(event);
    try {
        const userAdmin = await get({
            TableName: adminTable,
            Key: adminKey,
        });
        // Check that user is admin.
        if (userAdmin.Item === undefined) {
            return unauthorized('Not authorized to access this project.');
        }
        const projectResponse = await get({
            TableName: projectsTableName,
            Key: projectKey,
        });
        const project = projectResponse.Item;
        if (project === undefined) {
            return notFound('No project exists for the given projectId');
        }
        // Iterate through project lessons and check if given id already exists.
        const existingLessons = project.lessons.filter(
            item => item.lessonId === lesson.lessonId,
        );
        if (existingLessons.length > 0) {
            return conflict('A lesson with the given lessonId already exists');
        }
        project.lessons.push(lesson);
        const updateSuccess = await updateProjectLessons(projectKey, project.lessons);
        if (!updateSuccess) {
            return failure('Could not update the given project with the lesson');
        }
        return resourceCreated(lesson);
    } catch (err) {
        return failure(err);
    }
};

export const main = verifyBodyParamsExist(
    [
        'projectId',
        'name',
        'image',
        'link',
        'linkText',
        'description',
    ],
    createLesson,
);

import uuid from 'uuid';
import get from '../crud/get';
import {
    failure, conflict, unauthorized, resourceCreated, notFound,
} from '../../libs/response-lib';
import { verifyBodyParamsExist } from '../../libs/api-helper-lib';
import { updateProjectLessons } from './lessons-helper';

const prepare = (event) => {
    const {
        lessonName,
        image,
        link,
        linkText,
        lessonDescription,
        projectId,
    } = JSON.parse(event.body);
    return {
        projectsTableName: process.env.projectsTableName,
        adminTable: process.env.projectAdminTableName,
        lesson: {
            lessonId: uuid.v4(),
            lessonName,
            image,
            link,
            linkText,
            lessonDescription,
            createdAt: Date.now(),
        },
        adminKey: {
            userId: event.requestContext.identity.cognitoIdentityId,
            projectId,
        },
        projectKey: {
            projectId,
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
        console.log(err, err.stack);
        return failure(err.message);
    }
};

export const main = verifyBodyParamsExist(
    [
        'projectId',
        'lessonName',
        'image',
        'link',
        'linkText',
        'lessonDescription',
    ],
    createLesson,
);

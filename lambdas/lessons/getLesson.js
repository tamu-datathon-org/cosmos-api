import get from '../crud/get';
import {
    failure, notFound, success,
} from '../../libs/response-lib';
import { verifyQueryParamsExist } from '../../libs/api-helper-lib';
import { projectChallenges } from './lessons-helper';
import list from '../crud/list';

const prepare = event => ({
    projectsTableName: process.env.projectsTableName,
    adminTable: process.env.projectAdminTableName,
    projectKey: {
        projectId: event.queryStringParameters.projectId,
    },
    lessonId: event.pathParameters.id,
    adminKey: {
        userId: event.requestContext.identity.cognitoIdentityId,
        projectId: event.queryStringParameters.projectId,
    },
});

const getLesson = async (event) => {
    const {
        projectsTableName, adminTable, projectKey, lessonId, adminKey,
    } = prepare(event);
    try {
        const projectResponse = await get({
            TableName: projectsTableName,
            Key: projectKey,
        });
        const project = projectResponse.Item;
        if (project === undefined) {
            return notFound('No project exists for the given projectId');
        }
        // Iterate through project lessons and check if given id already exists.
        const matchingLesson = project.lessons.filter(
            item => item.lessonId === lessonId,
        );
        if (matchingLesson.length === 0) {
            return notFound('No lesson exists with the given lessonId');
        }
        const lesson = matchingLesson[0];
        // Get all challenges from that lesson.
        const challenges = await list(projectChallenges(projectKey.projectId));
        const lessonChallenges = challenges.filter(item => item.lessonId === lessonId);
        // Respond with challenges based on whether user is admin or not.
        const userAdmin = await get({
            TableName: adminTable,
            Key: adminKey,
        });
        if (userAdmin.Item === undefined) {
            const safeChallenges = lessonChallenges.map((item) => {
                const { solution, ...safeData } = item;
                return safeData;
            });
            return success({ lesson, challenges: safeChallenges });
        }
        return success({ lesson, challenges: lessonChallenges });
    } catch (err) {
        return failure(err);
    }
};

export const main = verifyQueryParamsExist(
    [
        'projectId',
    ],
    getLesson,
);

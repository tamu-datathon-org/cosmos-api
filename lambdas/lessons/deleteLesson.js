import get from '../crud/get';
import batch from '../crud/batchWrite';
import list from '../crud/list';
import { failure, success, unauthorized, notFound } from '../../libs/response-lib';
import { verifyQueryParamsExist } from '../../libs/api-helper-lib';
import { updateProjectLessons, projectChallenges } from './lessons-helper';

const prepare = event => ({
    projectsTableName: process.env.projectsTableName,
    adminTable: process.env.projectAdminTableName,
    projectKey: {
        projectId: event.queryStringParameters.projectId,
    },
    adminKey: {
        userId: event.requestContext.identity.cognitoIdentityId,
        projectId: event.queryStringParameters.projectId,
    },
    lessonId: event.pathParameters.id,
});

const lessonChallengesDelete = challenges => ({
    RequestItems: {
        [process.env.challengesTableName]: challenges.map(challenge => ({
            DeleteRequest: {
                Key: {
                    projectId: challenge.projectId,
                    challengeId: challenge.challengeId,
                },
            },
        })),
    },
});

const deleteLesson = async (event) => {
    const {
        projectsTableName, adminTable, projectKey, adminKey, lessonId,
    } = prepare(event);
    try {
        // User needs to be admin to delete challenge.
        const userAdmin = await get({
            TableName: adminTable,
            Key: adminKey,
        });
        if (userAdmin.Item === undefined) {
            return unauthorized('Not authorized to access this challenge');
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
        const finalLessons = project.lessons.filter(
            item => item.lessonId !== lessonId,
        );
        if (finalLessons.length < project.lessons.length) {
            // Delete challenges from that lesson.
            const challenges = await list(projectChallenges(projectKey.projectId));
            const challengesToDelete = challenges.filter(item => item.lessonId === lessonId);
            if (challengesToDelete.length > 0) {
                await batch(lessonChallengesDelete(challengesToDelete));
            }
            const updateSuccess = await updateProjectLessons(projectKey, finalLessons);
            if (!updateSuccess) {
                return failure('Could not update the given project with the lesson');
            }
        }
        return success();
    } catch (err) {
        console.log(err, err.stack);
        return failure(err.message);
    }
};

export const main = verifyQueryParamsExist(['projectId'], deleteLesson);

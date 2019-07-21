import { success, failure, notFound } from '../../libs/response-lib';
import { scoreChallengeCore } from './scoreChallenge';
import { verifyQueryParamsExist } from '../../libs/api-helper-lib';
import { getProjectCore } from '../projects/getProject';

const prepare = event => ({
    projectsTableName: process.env.projectsTableName,
    usersTableName: process.env.usersTableName,
    attemptsTableName: process.env.attemptsTableName,
    challengesTableName: process.env.challengesTableName,
    userKey: {
        email: event.queryStringParameters.email,
    },
    projectKey: {
        projectId: event.pathParameters.id,
    },
});

const getScoredChallenge = (challengeId, eventData) => scoreChallengeCore({
    challengeKey: { challengeId, projectId: eventData.projectKey.projectId },
    ...eventData,
});

const getScoredChallenges = (challenges, eventData) =>
    Promise.all(challenges.map(({ challengeId }) => getScoredChallenge(challengeId, eventData)));

const joinLessonChallenges = (lessons, scoredChallenges) => lessons.map(lesson => ({
    challenges: scoredChallenges.filter(chal => chal.lessonId === lesson.lessonId),
    ...lesson,
}));

const getScoredProjectCore = async (eventData) => {
    const { challenges, lessons, ...rest } = await getProjectCore(eventData);
    const scoredChallenges = await getScoredChallenges(challenges, eventData);
    const joinedLessons = await joinLessonChallenges(lessons, scoredChallenges);
    return { lessons: joinedLessons, ...rest };
};

const getScoredProject = async (event) => {
    const eventData = prepare(event);
    try {
        const joinedProject = await getScoredProjectCore(eventData);
        return success(joinedProject);
    } catch (err) {
        if (err.name === 'NotFoundError') {
            return notFound(err.message);
        }
        return failure(err);
    }
};

export const main = verifyQueryParamsExist(['email'], getScoredProject);

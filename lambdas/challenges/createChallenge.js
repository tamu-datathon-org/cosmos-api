import create from '../crud/createBase';
import get from '../crud/getBase';
import {
    HTTPCodes,
    failure,
    buildResponse,
} from '../../libs/response-lib';
import { verifyBodyParamsExist } from '../../libs/api-helper-lib';

const prepare = (event) => {
    const data = JSON.parse(event.body);
    return {
        challengesTable: process.env.challengesTableName,
        projectsTable: process.env.projectsTableName,
        userId: event.requestContext.identity.cognitoIdentityId,
        challenge: {
            challengeId: data.challengeId,
            projectId: data.projectId,
            name: data.name,
            points: data.points,
            passingThreshold: data.passingThreshold,
            solution: data.solution,
            createdAt: Date.now(),
        },
    };
};

const createChallenge = (event) => {
    const {tableName, userId, challenge} = prepare(event);
    
};

export const main = verifyBodyParamsExist(
    ['challengeId', 'projectId', 'name', 'points', 'passingThreshold', 'solution'],
    createChallenge,
);

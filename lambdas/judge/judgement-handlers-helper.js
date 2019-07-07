import get from '../crud/get';
import {
    NotFoundError,
} from '../../libs/errors-lib';

export const PROJECT_CHALLENGE_ID_SEPARATOR = '_?_';

// Get user and challenge asynchronously to check existence of both and then resolve with
// challenge object.
export const getUserAndChallenge = async (userKey, challengeKey, usersTableName, challengesTableName) => {
    const userPromise = get({
        TableName: usersTableName,
        Key: userKey,
    }).then((user) => {
        if (user.Item === undefined) {
            throw new NotFoundError('A user with the given email cannot be found.');
        }
        return user.Item;
    });

    const challengesPromise = get({
        TableName: challengesTableName,
        Key: challengeKey,
    }).then((challenge) => {
        if (challenge.Item === undefined) {
            throw new NotFoundError('A challenge with the given ID cannot be found in the given project.');
        }
        return challenge.Item;
    });

    return Promise.all([userPromise, challengesPromise]);
};

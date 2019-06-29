import {
    badRequest,
    unauthorizedRequest,
} from './response-lib';

// Verify that request coming to AWS lambda contains the needed keys in query parameters.
export const verifyQueryParamsExist = (keysToCheck, lambdaFunc) =>
    async (event, context) => {
        const queryParams = event.queryStringParameters;
        // Check all required keys exist in queryParams
        Object.entries(keysToCheck).forEach((key) => {
            if (!(key in queryParams)) {
                return badRequest({
                    error: `Required key not present in query parameters: ${key}`,
                });
            }
        });
        return await lambdaFunc(event, context);
    };

// Verify that request coming to AWS lambda contains the needed keys in the body.
export const verifyBodyParamsExist = (keysToCheck, lambdaFunc) =>
    async (event, context) => {
        const bodyJSON = JSON.parse(event.body);
        // Check all required keys exist in bodyJSON
        Object.entries(keysToCheck).forEach((key) => {
            if (!(key in bodyJSON)) {
                return badRequest({
                    error: `Required key not present in request body: ${key}`,
                });
            }
        });
        return await lambdaFunc(event, context);
    };
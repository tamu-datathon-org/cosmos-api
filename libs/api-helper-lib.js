import {
    badRequest,
} from './response-lib';

// Verify that request coming to AWS lambda contains the needed keys in query parameters.
export const verifyQueryParamsExist = (keysToCheck, lambdaFunc) =>
    async (event, context) => {
        const queryParams = event.queryStringParameters;
        // Check all required keys exist in queryParams
        for (let i = 0; i < keysToCheck.length; i += 1) {
            if (!(keysToCheck[i] in queryParams)) {
                return badRequest(`Required key not present in request body: ${keysToCheck[i]}`);
            }
        }
        return await lambdaFunc(event, context);
    };

// Verify that request coming to AWS lambda contains the needed keys in the body.
export const verifyBodyParamsExist = (keysToCheck, lambdaFunc) =>
    async (event, context) => {
        const bodyJSON = JSON.parse(event.body);
        // Check all required keys exist in bodyJSON
        for (let i = 0; i < keysToCheck.length; i += 1) {
            if (!(keysToCheck[i] in bodyJSON)) {
                return badRequest(`Required key not present in request body: ${keysToCheck[i]}`);
            }
        }
        return await lambdaFunc(event, context);
    };
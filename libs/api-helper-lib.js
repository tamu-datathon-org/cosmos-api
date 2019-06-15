import { badRequest } from './response-lib';

// Verify that request coming to AWS lambda contains the needed keys in query parameters
export const verifyQueryParameters = (keysToCheck, lambdaFunc) => {
    return async function (event, context) {
        var queryParams = event['queryStringParameters'];
        // Check all required keys exist in queryParams
        for (var keyInd in keysToCheck) {
            if (!(keysToCheck[keyInd] in queryParams)) {
                return badRequest({'error': `Required key not present in query parameters: ${keysToCheck[keyInd]}`})
            }
        }
        return await lambdaFunc(event, context);
    }
}

// Verify that request coming to AWS lambda contains the needed keys in the body
export const verifyBodyParameters = (keysToCheck, lambdaFunc) => {
    return async function (event, context) {
        const bodyJSON = JSON.parse(event.body);
        // Check all required keys exist in bodyJSON
        for (var keyIndex in keysToCheck) {
            if (!(keysToCheck[keyIndex] in bodyJSON)) {
                return badRequest({'error': `Required key not present in POST body: ${keysToCheck[keyIndex]}`})
            }
        }
        return lambdaFunc(event, context);
    }
}
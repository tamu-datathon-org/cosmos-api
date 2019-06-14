import { badRequest } from './response-lib';

// Verify that request coming to AWS lambda contains the needed keys
export function apiVerificationDecorator(primaryKey, keysToCheck, lambdaFunc) {
    return async function (event, context) {
        var mapToCheck = event;
        if (primaryKey != "") {
            mapToCheck = event[primaryKey]
            if (mapToCheck == null) {
                return badRequest({'error': `Required key(s) not present in query: [${keysToCheck.join(", ")}]`})
            }
        }
        // Check all required keys exist in map
        for (var keyInd in keysToCheck) {
            if (!(keysToCheck[keyInd] in mapToCheck)) {
                return badRequest({'error': `Required key not present in query: ${keysToCheck[keyInd]}`})
            }
        }
        return await lambdaFunc(event, context);
    }
}
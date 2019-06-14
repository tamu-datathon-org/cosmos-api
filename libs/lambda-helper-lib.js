import { badRequest } from './response-lib';

export function apiVerificationDecorator(primaryKey, keysToCheck, lambdaFunc) {
    return async function (event, context) {
        var mapToCheck = event;
        if (primaryKey != "") {
            mapToCheck = event[primaryKey]
        }
        // Check all required keys exist in map
        for (var keyInd in keysToCheck) {
            if (!(keysToCheck[keyInd] in mapToCheck)) {
                return badRequest({'error': `Required key not present in query: \'${keysToCheck[keyInd]}\'`})
            }
        }
        return await lambdaFunc(event, context);
    }
}
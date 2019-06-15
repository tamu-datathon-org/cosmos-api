export function success(body) {
    return buildResponse(HTTPCodes.SUCCESS, body);
}

export function failure(body) {
    return buildResponse(HTTPCodes.SERVER_ERROR, body);
}

export function badRequest(body) {
    return buildResponse(HTTPCodes.BAD_REQUEST, body);
}

export function respond(statusCode, body) {
    return new Promise((resolve) => resolve(buildResponse(statusCode, body)))
}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(body),
    };
}

export const HTTPCodes = {
    // 2XX Codes
    SUCCESS: 200,
    RESOURCE_CREATED: 201,
    // 4XX Codes
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ALLOWED: 406,
    CONFLICT: 409,
    // 5XX Codes
    SERVER_ERROR: 500,
}
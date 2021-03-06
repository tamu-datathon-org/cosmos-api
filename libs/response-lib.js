/* eslint-disable max-len */
// BODY BUILDERS //
export const buildBody = (data, errors) => ({
    data,
    errors,
});

export const emptyBody = buildBody({}, []);

export const errorBody = err => buildBody({}, [err]);

export const dataBody = data => buildBody(data, []);

export const conflictMsg = 'The object you tried to create already exists.';

export const notFoundMsg = 'Item not found.';

export const unauthorizedMsg = 'This request needs authorization';

// RESPONSE BUILDERS //
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
    PRECONDITION_FAILED: 412,
    // 5XX Codes
    SERVER_ERROR: 500,
};

export const buildResponse = (statusCode, body) => ({
    statusCode,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
});

// 2XX Responses

export const success = data => buildResponse(HTTPCodes.SUCCESS, dataBody(data));

export const resourceCreated = data => buildResponse(HTTPCodes.RESOURCE_CREATED, dataBody(data));

export const emptySuccess = () => success(emptyBody);

export function respond(statusCode, body) {
    return new Promise(resolve => resolve(buildResponse(statusCode, body)));
}

// Failures

export const unauthorizedRequest = () => buildResponse(HTTPCodes.UNAUTHORIZED, errorBody('This request needs authorization'));

export const conflict = (err = conflictMsg) => buildResponse(HTTPCodes.CONFLICT, errorBody(err));

export const unauthorized = (err = unauthorizedMsg) => buildResponse(HTTPCodes.UNAUTHORIZED, errorBody(err));

export const notFound = (err = notFoundMsg) => buildResponse(HTTPCodes.NOT_FOUND, errorBody(err));

// err: string - the message you want to send in the response body
export const failure = err => buildResponse(HTTPCodes.SERVER_ERROR, errorBody(err));

export const badRequest = err => buildResponse(HTTPCodes.BAD_REQUEST, errorBody(err));

export const preconditionFailed = err => buildResponse(HTTPCodes.PRECONDITION_FAILED, errorBody(err));

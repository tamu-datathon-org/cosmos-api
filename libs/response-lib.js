// BODY BUILDERS //
export const buildBody = (data, errors) => ({
    data,
    errors,
});

export const emptyBody = buildBody({}, []);

export const errorBody = (err) => buildBody({}, [err]);

export const dataBody = (data) => buildBody(data, []);

export const conflictBody = buildBody({}, [
    { message: 'The object you tried to create already exists.' },
]);

export const notFoundBody = buildBody({}, [{ message: 'Item not found.' }]);

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
    // 5XX Codes
    SERVER_ERROR: 500,
};

export const buildResponse = (statusCode, body) => ({
    statusCode: statusCode,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
});

export const success = (body) => buildResponse(HTTPCodes.SUCCESS, body);

export const failure = (error) => buildResponse(HTTPCodes.SERVER_ERROR, errorBody(error));

export const badRequest = (body) => buildResponse(HTTPCodes.BAD_REQUEST, body);

export const unauthorizedRequest = () => buildResponse(HTTPCodes.UNAUTHORIZED, errorBody('This request needs authorization'));

export const emptySuccess = () => success(emptyBody);

export const dataSuccess = (data) => success(dataBody(data));

export const conflictFailure = () => buildResponse(HTTPCodes.CONFLICT, conflictBody);

export const notFoundFailure = () => buildResponse(HTTPCodes.NOT_FOUND, notFoundBody);

export function respond(statusCode, body) {
    return new Promise((resolve) => resolve(buildResponse(statusCode, body)));
}

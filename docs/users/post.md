# Create User

Creates a new user with the provided information. User is access through email and internal ID is the cognitio ID provided by AWS.

**URL** : `/users`

**Method** : `POST`

**AWS Auth required** : YES

**Permissions required** : AWS Cognito ID

**Required parts of request:** `['email', 'firstName', 'lastName']`

## Success Response

**Code** : `201 Resource Created`

**Request**

The cognito ID is provided by AWS, so we just need the following fields in the POST body.

```json
{
    "fistName": "Testy",
    "lastName": "McTestFact",
    "email": "testy@example.com"
}
```

## Notes

* Endpoint will return a `409 Conflict` if a user with the same email exists.
# Get Project

Gets a project with the given ID. Needs AWS auth, but user does not need to be admin.

**URL** : `/projects/{projectId}`

**Method** : `GET`

**AWS Auth required** : YES

**Permissions required** : AWS Cognito ID

## Success Response

**Code** : `200 OK`

**Request:** `GET /projects/cosmos`

**Response:**

```json
{
    "projectId": "cosmos",
    "projectName": "Cosmos",
    "projectDescription": "The best project ever created.",
    "lessons": [],
    "createdAt": "<timestamp>"
}
```
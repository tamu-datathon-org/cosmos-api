# Create Project

Creates a new project with the given information and makes the current user an admin of that project.

**URL** : `/projects`

**Method** : `POST`

**AWS Auth required** : YES

**Permissions required** : AWS Cognito ID

**Required parts of request:** `['projectId', 'projectName', 'projectDescription']`

## Success Response

**Code** : `201 Resource Created`

**Request:** `POST /projects`

**Body:**:
```json
{
    "projectId": "cosmos",
    "projectName": "Cosmos",
    "projectDescription": "The best project ever created."
}
```

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

## Notes

* Endpoint will return a `409 Conflict` if a project with the same ID exists. 
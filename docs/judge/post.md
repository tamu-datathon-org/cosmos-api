# Judge Attempt

Creates a new attempt for the user with the given email for the specified challenge in the given project. Returns whether the user passed, how many points they earned, and their score.

**URL** : `/judge/attempt`

**Method** : `POST`

**AWS Auth required** : No

**Permissions required** : None

**Required parts of request:** `['email', 'projectId', 'challengeId', 'solution']`

## Success Response

**Code** : `201 Resource Created`

**Request:** `POST /judge/attempt`

**Body:**:
```json
{
    "email": "testy@example.com",
    "projectId": "cosmos",
    "challengeId": "loading_data",
    "solution": "[1, 2, 3, 4]"
}
```

**Response:**

```json
{
    "passed": true,
    "points": "10",
    "score": 0.9
}
```

## Notes

* Endpoint will return a `409 Not Found` if the given user, project or challenge does not exist. The error message will specify which.
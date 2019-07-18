# Get Project

Gets a project with the given ID. Needs AWS auth, but user does not need to be admin.

**URL** : `/score/challenge/{challengeId}?email=<email>&projectId=<projectId>`

**Method** : `GET`

**AWS Auth required** : YES

**Permissions required** : AWS Cognito ID

## Success Response

**Code** : `200 OK`

**Request:** `GET /score/challenge/load_data?email="testy@example.com"&projectId=cosmos`

**Response:**

```json
{
    "passed": true,
    "points": "10",
    "score": 0.9
}
```

## Notes

* Only returns a `passed: false` if the user has no attempts that pass the challenge.
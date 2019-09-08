# Get User

Gets the user based on the given email. Needs the AWS auth cognito ID to match the stored userId.

**URL** : `/users?email=<email>`

**Method** : `GET`

**AWS Auth required** : YES

**Permissions required** : AWS Cognito ID

## Success Response

**Code** : `200 OK`

**Request:** `GET /users?email="testy@example.com"`

**Response**

```json
{
    "fistName": "Testy",
    "lastName": "McTestFact",
    "email": "testy@example.com"
}
```

## Notes

* Returns a `401 Unathorized` if cognito user ID and stored user ID do not match.
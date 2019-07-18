# Create User

Updates the user given by the email with the data in the PUT body. The cognito user ID and stored user ID need to match.

**URL** : `/users?email=<email>`

**Method** : `PUT`

**AWS Auth required** : YES

**Permissions required** : AWS Cognito ID

**Fields that can be updates:**
* firstName
* lastName

## Success Response

**Code** : `200 OK`

**Request:** `PUT /users?email="testy@example.com"`

**Body:**:

```json
{
    "firstName": "Testy",
    "lastName": "Johnson"
}
```

**Response**

```json
{
    "fistName": "Testy",
    "lastName": "Johnson",
    "email": "testy@example.com"
}
```

## Notes

* Returns a `401 Unathorized` if cognito user ID and stored user ID do not match.
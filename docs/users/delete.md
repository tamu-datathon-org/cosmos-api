# Delete User

Deletes a user with the given email. The cognitoID stored in the user object should match the cognitoID provided by AWS auth.

**URL** : `/users?email=<email>`

**Method** : `DELETE`

**AWS Auth required** : YES

**Permissions required** : AWS Cognito ID

## Success Response

**Code** : `200 OK`

## Notes

* Returns a `401 Unathorized` if cognito user ID and stored user ID do not match.
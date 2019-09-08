# Delete Project

Deletes the project with the given ID. User needs to be authenticated with AWS and an admin to delete.

**URL** : `/projects/{projectId}`

**Method** : `DELETE`

**AWS Auth required** : YES

**Permissions required** : AWS Cognito ID

## Success Response

**Code** : `200 OK`

**Request:** `DELETE /projects/cosmos`

**Response:** Empty data body

## Notes
* Returns a `401 Unauthorized` if user is not admin.
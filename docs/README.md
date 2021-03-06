# Cosmos API

This folder contains the documentation for the endpoints for the Cosmos backend. The server runs off AWS lambda and static files are served through S3 Buckets on AWS. 

* Development URL: `https://kinp7jc6ad.execute-api.us-east-1.amazonaws.com/dev`
* Production URL: `https://kinp7jc6ad.execute-api.us-east-1.amazonaws.com/prod`

The paths for the endpoints need to be appended to these URLs.

## Rules

* **Successful response codes:**
    * GET: `200 Success`
    * POST: `201 Resource Created`
    * DELETE: `200 Success`
    * PUT: `200 Success`
* Paths with elements wrapped with `{}` are path parameters, and the element name would specify which field needs to be given as the path parameter
* Other than POST & PUT requests, all requests must send information through query string parameters

## User endpoints

* [Create User](users/post.md) : `POST /users` (**AWS Auth Required**)
* [Delete User](users/delete.md) : `DELETE /users?email=<email>` (**AWS Auth Required**)
* [Get User](users/get.md) : `GET /users?email=<email>` (**AWS Auth Required**)
* [Update User](users/update.md) : `UPDATE /users?email=<email>` (**AWS Auth Required**)

## Projects endpoints

* [Create Project](projects/post.md) : `POST /projects` (**AWS Auth Required**)
* [Delete Project](projects/delete.md) : `DELETE /projects/{projectId}` (**AWS Auth Required**)
* [Get Project](projects/get.md) : `GET /projects/{projectId}` (**AWS Auth Required**)

## Judging endpoints

* [Judge Attempt](judge/post.md) : `POST /judge/attempt`

## Scoring endpoints

* [Score Challenge](score/get-score-challenge.md) : `GET /score/challenge/{challengeId}?email=<email>&projectId=<projectId>` (**AWS Auth Required**)

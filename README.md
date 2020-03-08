# Cosmos :milky_way:

## General Information :information_source:
* This is meant to be hosted on AWS, using services like Lambda, DynamoDB and more
* The project uses [serverless](http://serverless-stack.com) to make development and testing using AWS easier, because it could be a pain otherwise. 
  * Check out `docs/serverless-readme.md`  for more information
* The `docs/` directory has information for the endpoints served by the API
  * Look at `serverless.yml` and the various `lambdas/*-handlers.yml` for more information on these

## Getting Started :running:
* Get access to your AWS IAM User Access ID & Access Key
* Install the Serverless framework using `npm i -g serverless`
* Install the AWS CLI using `pip install awscli`
* Configure your AWS credentials for Serverless to use using `aws configure`
  * You'll be asked for your Access ID, Access Key and the preferred location
* You now have access to various Serverless functions
  * Use `serverless invoke local --function <function>` to locally run a lambda function
  * Use `serverless offline start` to run the Gateway & lambda functions locally
  * Use `serverless deploy` to deploy a new build

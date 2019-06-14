import { getUserModel } from '../../libs/mongodb-lib';
import { getUser } from '../../libs/userdb-lib';
import { apiVerificationDecorator } from '../../libs/lambda-helper-lib'
import { success, failure } from '../../libs/response-lib';

async function lambdaGetUser(event, context) {
    var userEmail = event['queryStringParameters']['email']
    var projectId = event['queryStringParameters']['project_id']
    const userModel = await getUserModel()
    return await getUser(userModel, userEmail, projectId).then((user) => {
        return success(user);
    }).catch((err) => {
        return failure(err);
    })
}

module.exports.main = apiVerificationDecorator('queryStringParameters', ['email', 'project_id'], lambdaGetUser)

export async function getUser(userModel, userEmail, projectId) {
    const user = await userModel.findOne({
        email: userEmail,
        project_id: projectId
    })
    if (user == null) {
        return Promise.reject("User does not exist.")
    }
    return Promise.resolve(user)
}
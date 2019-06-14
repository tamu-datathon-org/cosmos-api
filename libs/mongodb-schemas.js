// TODO: Define all mongodb schemas here
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new Schema({
    user_id: String,
    user_name: String,
    first_name: String,
    last_name: String,
    email: String,
    project_id: String,
    attempts: {
        type: Map,
        of: [ObjectId]
    }
})

module.exports = {
    UserSchema: UserSchema
}
import { UserSchema } from './mongodb-schemas';

var mongoose = require('mongoose');
let cachedConn = null;

async function getMongoDBConnection() {
    if (cachedConn != null) {
        return cachedConn;
    }

    var newConn = await mongoose.createConnection(process.env.mongoDbUri, {
        useNewUrlParser: true,
        bufferCommands: false,
        bufferMaxEntries: 0
    });
    if (newConn != undefined) {
        cachedConn = newConn;
    }
    return newConn;
}

export async function getUserModel() {
    var conn = await getMongoDBConnection();
    return conn.model("user", UserSchema);
}
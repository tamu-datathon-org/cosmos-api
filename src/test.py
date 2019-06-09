from pymongo import MongoClient
from db.attempts_client import AttemptsClient
from db.user_client import UserClient

MONGO_CLIENT_PASSWORD = "ahZu73V2AnvkW918K9AB"
MONGO_CLIENT_URI_TEMPLATE = "mongodb+srv://gcp-app-engine-datathon-2019:{password}@tamu-datathon-2019-gf05r.gcp.mongodb.net/test?retryWrites=true&w=majority"

users = UserClient()
attempts = AttemptsClient()

user = users.get_user("phulsechinmay", "tamu_datathon")
print(attempts.get_attempts_for_challenge(user["attempts"]["data_wrangling_challenge_1"]))
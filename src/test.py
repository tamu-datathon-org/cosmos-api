from pymongo import MongoClient
from db.attempts_client import AttemptsClient
from db.user_client import UserClient

users = UserClient()
attempts = AttemptsClient()

user = users.get_user("phulsechinmay", "tamu_datathon")
print(user)
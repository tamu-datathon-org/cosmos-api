from typing import Dict

import pymongo

from .db_client import DBClient
from .db_errors import *

MONGO_USERS_COLLECTION_ID = "users"

class UserClient(object):
    def __init__(self):
        try:
            DBClient.init()
        except:
            raise MongoConnectionError("Could not connect to the MongoDB Database")
        self.client = DBClient.get_database()[MONGO_USERS_COLLECTION_ID]

    def create_user(self, user_name: str, project_id: str, first_name: str, last_name: str, user_email: str) -> bool:
        new_user = {
            "user_name": user_name,
            "project_id": project_id,
            "first_name": first_name,
            "last_name": last_name,
            "email": user_email,
            "attemps": {}
        }
        try:
            self.client.insert_one(new_user)
        except:
            return False 
        
        return True

    def check_user_exists(self, user_name: str, project_id: str) -> bool:
        return not self.client.find_one({
            "user_name": user_name,
            "project_id": project_id
        })
    
    def get_user(self, user_name: str, project_id: str) -> Dict:
        return self.client.find_one({
            "user_name": user_name,
            "project_id": project_id
        })
from typing import Dict, List

import pymongo

from .db_client import DBClient
from src.helpers.error_helper import *

MONGO_ATTEMPTS_COLLECTION_ID = "attempts"

class AttemptsClient(object):
    def __init__(self):
        try:
            DBClient.init()
        except:
            raise MongoConnectionError("Could not connect to the MongoDB Database")
        self.client = DBClient.get_database()[MONGO_ATTEMPTS_COLLECTION_ID]

    def get_attempts(self, user_id: str, attempt_ids: List[str]) -> List[Dict]:
        return list(self.client.find({
            "_id" : {"$in" : attempt_ids}, 
            "user_id": user_id
        }))
from typing import Dict, List

import pymongo

from .db_client import DBClient
from .db_errors import *

MONGO_ATTEMPTS_COLLECTION_ID = "attempts"

class AttemptsClient(object):
    def __init__(self):
        try:
            DBClient.init()
        except:
            raise MongoConnectionError("Could not connect to the MongoDB Database")
        self.client = DBClient.get_database()[MONGO_ATTEMPTS_COLLECTION_ID]

    def get_attempts_for_challenge(self, attempt_ids: List[str]) -> List[Dict]:
        return list(self.client.find({"_id" : {"$in" : attempt_ids}}))
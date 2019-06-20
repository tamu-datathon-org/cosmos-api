from typing import Dict, List

import pymongo

from .db_client import DBClient
from src.helpers.error_helper import *

MONGO_CHALLENGES_COLLECTION_ID = "challenges"

class ChallengesClient(object):
    def __init__(self):
        try:
            DBClient.init()
        except:
            raise MongoConnectionError("Could not connect to the MongoDB Database")
        self.client = DBClient.get_database()[MONGO_CHALLENGES_COLLECTION_ID]

    def get_all_challenges_for_project(self, project_id: str) -> List[Dict]:
        return list(self.client.find({"project_id": project_id}))

    def get_challenge_for_project(self, challenge_id: str, project_id: str) -> Dict:
        return dict(self.client.find({
            "challenge_id": challenge_id,
            "project_id": project_id
        }))
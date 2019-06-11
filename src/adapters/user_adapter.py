from typing import Tuple, Dict

from ..helpers.http_helper import HTTPCodes
from ..helpers.error_helper import *
from ..db.user_client import user_client
from ..db.attempts_client import AttemptsClient
from src.judging.judugement_engine import JudgingEngine

class UserAdapter(object):

    def __init__(self):
        self.user_client = UserClient() # Can throw MongoConnectionError
        self.attempts_client = AttemptsClient() # Can throw MongoConnectionError

    def register_user(self, user_name: str, project_id: str, first_name: str, last_name: str, user_email: str) -> int:
        if self.user_client.check_user_exists(user_name, project_id):
            return HTTPCodes.NOT_ALLOWED

        user_created = self.user_client.create_user(user_name, project_id, first_name, last_name, user_email)
        if not user_created:
            return HTTPCodes.INTERNAL_SERVER_ERROR

        return HTTPCodes.RESOURCE_CREATED

    def _judge_from_existing_attempts(self, user_id: str, project_id: str, attempt_ids: str, minimum_score: float) -> float:
        final_score = 0
        user_attempts = self.attempts_client.get_attempts(user_id, attempt_ids)
        judging_engine = JudgingEngine()
        for attempt in user_attempts:
            # No way to judge attempt, skip
            if ('score' not in attempt) and ('values' not in attempts):
                continue

            attempt_score = 0
            if 'score' in attempt:
                attempt_score = attempt['score']
            else:
                

            


    def get_score_for_challenge(self, user_id: str, project_id: str, challenge_id: str) -> float:
        pass
from typing import Tuple, Dict, List

from src.helpers.http_helper import HTTPCodes
from src.helpers.error_helper import *
from src.db.user_client import UserClient
from src.db.attempts_client import AttemptsClient
from src.db.challenges_client import ChallengesClient
from src.judging.judgement_engine import JudgingEngine

class UserAdapter(object):

    def __init__(self):
        self.user_client = UserClient() # Can throw MongoConnectionError
        self.attempts_client = AttemptsClient() # Can throw MongoConnectionError
        self.challenges_client = ChallengesClient() # Can throw MongoConnectionError

    def register_user(self, user_id: str, project_id: str, first_name: str, last_name: str, user_email: str) -> int:
        if self.user_client.check_user_exists(user_id, project_id):
            return HTTPCodes.NOT_ALLOWED

        self.user_client.create_user(user_id, project_id, first_name, last_name, user_email)
        return HTTPCodes.RESOURCE_CREATED

    """
    Description: Will judge existing attempts from a user.

    Returns: float specifying 1.0 for passing and 0.0 for failing.
    Possible Errors: InternalServerError
    """
    def _judge_from_existing_attempts(self, user_id: str, project_id: str, attempt_ids: str, truth_values: List, metric: str, required_score: float = 1.0) -> Dict:
        final_score = 0.0
        user_attempts = self.attempts_client.get_attempts(user_id, attempt_ids)

        judging_engine = JudgingEngine()
        for attempt in user_attempts:
            # No way to judge attempt, skip
            if ('score' not in attempt) and ('values' not in attempt):
                continue

            attempt_score = 0
            if 'score' in attempt:
                attempt_score = attempt['score']
            else:
                attempt_score = judging_engine.judge(attempt['values'], truth_values, metric)

            if attempt_score >= required_score:
                return 1.0

        return final_score 

    def get_attempts_info(self, user_id: str, project_id: str) -> List[Dict]:
        project_challenges = self.challenges_client.get_all_challenges_for_project(project_id = project_id)
        user = self.user_client.get_user(user_id=user_id, project_id=project_id)
        if 'attempts' not in user:
            return {}

        attempts_info = {}

        for challenge in project_challenges:
            if any(key not in challenge for key in []):
                continue
            if 'challenge_id' not in user['attempts']:
                continue
            attempt_ids = user['attempts']['challenge_id']
            challenge_score = 
            
            
            



    def get_score_for_challenge(self, user_id: str, project_id: str, challenge_id: str) -> float:
        pass
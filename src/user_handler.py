"""
TODO: Add all user handler functions here
"""

from src.db.user_client import UserClient
from src.helpers.http_helper import HTTPCodes
from bson import json_util

def get_user(event, context):
    user_id = event['queryStringParameters']['user_id']
    project_id = event['queryStringParameters']['project_id']

    user_client = UserClient()

    user = user_client.get_user(user_id, project_id)
    user.pop("_id")
    response = {
        "statusCode": HTTPCodes.SUCCESS,
        "body": json_util.dumps(user)
    }

    return response
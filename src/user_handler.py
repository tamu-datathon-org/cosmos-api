"""
TODO: Add all user handler functions here
"""

from src.db.user_client import UserClient
from src.helpers.http_helper import HTTPCodes
from bson import json_util

def get_user(event, context):
    user_name = event['queryStringParameters']['user_name']
    project_id = event['queryStringParameters']['project_id']

    user_client = UserClient()

    user = user_client.get_user(user_name, project_id)
    user.pop("_id")
    response = {
        "statusCode": HTTPCodes.SUCCESS,
        "body": json_util.dumps(user)
    }

    return response
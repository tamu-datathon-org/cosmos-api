from pymongo import MongoClient

MONGO_CLIENT_PASSWORD = "ahZu73V2AnvkW918K9AB"
MONGO_CLIENT_URI_TEMPLATE = "mongodb+srv://gcp-app-engine-datathon-2019:{password}@tamu-datathon-2019-gf05r.gcp.mongodb.net/test?retryWrites=true&w=majority"

class DBClient:
    db_client = {}

    @staticmethod
    def init():
        if not DBClient.db_client:
            DBClient.db_client = MongoClient(MONGO_CLIENT_URI_TEMPLATE.format(password=MONGO_CLIENT_PASSWORD))

    @staticmethod
    def get_database(db_name="datathon-2019"):
        if not DBClient.db_client:
            return None

        return DBClient.db_client[db_name]

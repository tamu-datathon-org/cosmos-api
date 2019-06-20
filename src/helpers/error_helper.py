

# ====== DB ERRORS ==========
class MongoConnectionError(Exception):
    pass

class UserNotFoundError(Exception):
    pass

class ProjectNotFoundError(Exception):
    pass

class ChallengeNotFoundError(Exception):
    pass

class ChallengeConfigError(Exception):
    pass

class UserClientError(Exception):
    pass

class InternalServerError(Exception):
    pass

class AdapterInitError(Exception):
    pass

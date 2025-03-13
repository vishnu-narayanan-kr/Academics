from flask_restful import Resource, reqparse

# In-memory storage
users = []

parser = reqparse.RequestParser()
parser.add_argument('name', type=str, required=True, help="Name is required")
parser.add_argument('email', type=str, required=True, help="Email is required")

class AccountResource(Resource):
    def get(self):
        return {"users": users}, 200

    def post(self):
        args = parser.parse_args()
        user = {"id": len(users) + 1, "name": args["name"], "email": args["email"]}
        users.append(user)
        return {"message": "User registered", "user": user}, 201

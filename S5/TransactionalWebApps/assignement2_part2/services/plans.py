from flask_restful import Resource, reqparse

# In-memory storage
plans = []

parser = reqparse.RequestParser()
parser.add_argument('name', type=str, required=True, help="Plan name is required")
parser.add_argument('price', type=float, required=True, help="Price is required")

class PlanResource(Resource):
    def get(self):
        return {"plans": plans}, 200

    def post(self):
        args = parser.parse_args()
        plan = {"id": len(plans) + 1, "name": args["name"], "price": args["price"]}
        plans.append(plan)
        return {"message": "Plan added", "plan": plan}, 201

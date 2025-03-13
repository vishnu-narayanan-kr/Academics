from flask_restful import Resource, reqparse

# In-memory storage
billing_records = []

parser = reqparse.RequestParser()
parser.add_argument('user_id', type=int, required=True, help="User ID is required")
parser.add_argument('amount', type=float, required=True, help="Amount is required")

class BillingResource(Resource):
    def get(self):
        return {"billing_records": billing_records}, 200

    def post(self):
        args = parser.parse_args()
        record = {"id": len(billing_records) + 1, "user_id": args["user_id"], "amount": args["amount"], "status": "pending"}
        billing_records.append(record)
        return {"message": "Billing record added", "billing": record}, 201

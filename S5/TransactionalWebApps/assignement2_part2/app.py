from flask import Flask
from flask_restful import Api
from services.accounts import AccountResource
from services.billing import BillingResource
from services.plans import PlanResource

app = Flask(__name__)
api = Api(app)

# Register API endpoints
api.add_resource(AccountResource, '/accounts')
api.add_resource(BillingResource, '/billing')
api.add_resource(PlanResource, '/plans')

if __name__ == '__main__':
    app.run(debug=True)

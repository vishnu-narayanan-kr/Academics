### Overview

---

An API platform that allows for easy provisioning and modification of accounts on various services.

### API Documentation

---

Please refer to the API document on [https://iristelx.api-docs.io/](https://iristelx.api-docs.io/)

### Services

---

Amazon SQS
: Amazon Simple Queue Service that is used to process messages in webhook calls for certain platform events.

Broadsoft
: Service that handles actions related to assigning/configuring telephone numbers to/for users including voicemail.

Espresso
: Service to handle porting requests.

Huawei
: Service that handles all actions related to the mobile switching centre(MSC).

IPSwitch
: Service that handles all vociemail storage.

MINDBill
: Service that handles all actions related to account provisioning, account goods, subproducts and callback management as well as all actions related to the financial transactions associated with accounts.

Nextologies
: Service that handles all actions related to the IPTV platform.

### Flows

---

Create New Master Account

```flow
st=>start: Start
cond1=>condition: New Account?
op1=>operation: Create IristelX Account
op2=>operation: Create IristelX Service
op3=>operation: Add IristelX Payment
op4=>operation: Add IristelX
Telephone Number
to Service
op5=>operation: Create IristelX Invoice
op6=>operation: Send Order to NAV
e=>end: End (return NAV
status response
"new" or "backorder",
"accountId", serviceId")

st->cond1
cond1(yes,bottom)->op1
cond1(no)->op2
op1(right)->op2
op2(bottom)->op3(bottom)->op4(bottom)->op5(bottom)->op6(right)->e()
```

```flow
st=>start: Start
cond1=>condition: New Account?
op1=>operation: Create IristelX Account
op2=>operation: Create IristelX Service
op3=>operation: Add IristelX Payment
op4=>operation: Add IristelX
Telephone Number
to Service
op5=>operation: Create IristelX Invoice
op6=>operation: Send Order to NAV
e=>end: End (return NAV
status response
"new" or "backorder",
"accountId", serviceId")

st->cond1
cond1(yes,bottom)->op1
cond1(no)->op2
op1(right)->op2
op2(bottom)->op3(bottom)->op4(bottom)->op5(bottom)->op6(right)->e()
```

### Environment Variables

---

`AWS_ACCESS_KEY_ID` - Amazon access key.

`AWS_REGION` - Amazon region. Default is **_us-east-1_**.

`AWS_SECRET_ACCESS_KEY` - Amazon secret key.

`AWS_SQS_WEBHOOK_QUEUE_URL` - Url to the IristelX Webhook Dispatcher Amazon queue.

`BROADSOFT_WSDL_URL` - Url to the wsdl for **Broadsoft** SOAP operations.

`CONNECTION_LIMIT` - Maximum number of open database connections. Default is **_5_** in Dev, **_30_** in Prod.

`DB` - The primary database.

`DB_HOST` - The host url of the database.

`DB_PASSWORD` - The root password for the IristelX database.

`DB_RETRIES` - Number of retries for failed database connections.

`DB_URL` - The full database url for IristelX.

`DB_USER` - The root username for the IristelX database.

`DEBUG` - Used to specify what to debug during development. Should be **_blank_** in **production**.

`ENCRYPTION_KEY` - Used to encyrpt/decrypt passwords (mainly used for third party requests).

`ERRORS_DB_URL` - The full database url for Postback Errors.

`ESPRESSO_DID_WSDL_URL` - Url to the wsdl for **Espresso** SOAP operations.

`HUAWEI_API_KEY` - API key used to make requests to **HUAWEI MSC**.

`HUAWEI_BASE_URL` - The base url for requests made to **HUAWEI MSC**.

`IPSWITCH_WSDL_URL` - Url to the wsdl for **IPSwitch** SOAP operations.

`IRISTELX_SYSTEM_KEY` - Master API key.

`LOG_LEVEL` - Level of information to display in the logs. Possible values are **error**, **warn**, **info**, **verbose** or **debug**. Default is **_info_**.

`MINDBILL_MASTER_PASSWORD` - Password of master account to **MINDBILL**.

`MINDBILL_MASTER_USERNAME` - Username of master account to **MINDBILL**.

`MIND_PMG_WSDL_URL` - Url to the wsdl for **MINDPMG** SOAP operations.

`MIND_WSDL_URL` - Url to the wsdl for **MINDBill** SOAP operations.

`NEXTOLOGIES_API_KEY` - API key used to make requests to **Nextologies**.

`NEXTOLOGIES_BASE_URL` - The base url for requests made to **Nextologies**.

`NODE_ENV` - The node environment. Ex: **development**, **production**.

`OPEN_ROUTES` - API routes that are not protected by API keys.

`QUOTAGUARDSTATIC_URL` - Url used to proxy requests.

`PAGE_LIMIT` - Maximum number of records to return per result set (pagination).

`PASSWORD_SALT` - Used to one-way hash API secrets.

`PORT` - The port to start the server on. Default is **_3000_**.

`SERVER_TIMEOUT` - Server timeout in millieconds to handle requests. Default is **_3000000_**.

`TOKEN_SALT` - Used to one-way hash API tokens.

`TZ` - Timezone to set for the server. Default is **_America/New_York_**.

`WEBHOOK_SQS_QUEUE_URL` - Url to the message queue for the IristelX webhook dispatcher.

// "use strict";

// const app = require("./../../bin/www");
// const chai = require("chai");
// const request = require("supertest");
// const expect = chai.expect;
// describe('Billing API Integration Tests', () => {
//   describe('#GET /:accountId balance', () => {
//     it('should get the balance for the specified account', (done) => {
//       request(app).get('/billing/ICENP1502838884529/balance').set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.oneOf([200, 302]);
//         expect(res.body.balance).to.exist;
//         done();
//       });
//     });
//   });
//   describe('#GET /:accountId/invoices invoices for specified account', () => {
//     it('should get invoices for a specified account', (done) => {
//       request(app).get('/billing/ICENP1502838508900/invoices').set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.oneOf([200, 302]);
//         expect(res.body.invoices).to.exist;
//         expect(res.body.invoices).to.be.an('array');
//         done();
//       });
//     });
//   });
//   describe('#GET /:accountId/invoices/:invoiceID get specified invoice', () => {
//     it('should get the specific inovice for the specified account', (done) => {
//       request(app).get('/billing/9614085/invoices/145254').set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.oneOf([200, 302]);
//         expect(res.body.invoiceId).to.exist;
//         expect(res.body.invoiceNumber).to.exist;
//         expect(res.body.total).to.exist;
//         expect(res.body.subtotal).to.exist;
//         expect(res.body.taxes).to.exist;
//         expect(res.body.currentBalance).to.exist;
//         expect(res.body.previousBalance).to.exist;
//         expect(res.body.dueDate).to.exist;
//         expect(res.body.startDate).to.exist;
//         expect(res.body.endDate).to.exist;
//         expect(res.body.issueDate).to.exist;
//         expect(res.body.status).to.exist;
//         done();
//       });
//     });
//   });
//   describe('#POST /:accountId/payments to an account', () => {
//     it('should post a payment to an account', (done) => {
//       request(app).post('/billing/ICENP1502838508900/payments').send({
//         "amount": 55.55,
//         "currency": "CAD",
//         "paymentMethod": "CASH",
//         "reference": "A123456789"
//       }).set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.oneOf([200, 302]);
//         expect(res.body.paymentId).to.exist;
//         expect(res.body.amount).to.exist;
//         expect(res.body.currency).to.exist;
//         expect(res.body.paymentMethod).to.exist;
//         expect(res.body.reference).to.exist;
//         done();
//       });
//     });
//     it('should fail to post a payment to an account due to missing paymentMethod', (done) => {
//       request(app).post('/billing/ICENP1502838508900/payments').send({
//         "amount": 55.55,
//         "currency": "CAD",
//         "reference": "A123456789"
//       }).set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.equal(400);
//         expect(res.body).to.be.an('array');
//         expect(res.body).to.have.lengthOf(2);        
//         done();
//       });
//     });
//     it('should fail to post a payment to an account due to missing amount', (done) => {
//       request(app).post('/billing/ICENP1502838508900/payments').send({
//         "paymentMethod": "CASH",
//         "currency": "CAD",
//         "reference": "A123456789"
//       }).set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.equal(400);
//         expect(res.body).to.be.an('array');
//         expect(res.body).to.have.lengthOf(2);        
//         done();
//       });
//     });
//     it('should fail to post a payment to an account due to missing currency', (done) => {
//       request(app).post('/billing/ICENP1502838508900/payments').send({
//         "paymentMethod": "CASH",
//         "amount": 55.55,
//         "reference": "A123456789"
//       }).set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.equal(400);
//         expect(res.body).to.be.an('array');
//         expect(res.body).to.have.lengthOf(2);        
//         done();
//       });
//     });
//   });   
//   describe('#PATCH /:accountId/automatic-payment configure payments on a postpaid account', () => {
//     it('should patch payment configuration on a postpaid account', (done) => {
//       request(app).patch('/billing/ICENP1502294786903/automatic-payment').send({
//         "enabled": true,
//         "paymentSource": "CREDITCARD",
//         "onDeclineSuspend": false,
//         "creditCard": {
//           "cardType": "VISA",
//           "number": "4111111111111111",
//           "holder": "Mr John Doe",
//           "expMonth": "09",
//           "expYear": "2021",
//           "CVV": "599"
//         }
//       }).set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.oneOf([200, 302]);
//         expect(res.body.enabled).to.exist;
//         expect(res.body.paymentSource).to.exist;
//         expect(res.body.onDeclineSuspend).to.exist;
//         expect(res.body.creditCard).to.exist;
//         done();
//       });
//     });
//     it('should fail due to missing required enabled property', (done) => {
//       request(app).patch('/billing/ICENP1502294786903/automatic-payment').send({
//         "paymentSource": "CREDITCARD",
//         "onDeclineSuspend": false,
//         "creditCard": {
//           "cardType": "VISA",
//           "number": "5555666677779999",
//           "holder": "Mr John Doe",
//           "expMonth": "09",
//           "expYear": "2021",
//           "CVV": "599"
//         }
//       }).set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.equal(400);
//         expect(res.body).to.be.an('array');
//         expect(res.body).to.have.lengthOf(2);
//         done();
//       });
//     });
//     it('should fail due to onDaysAvailable, onDayOfMonth and/or onBalanceBelow are not allowed on a postpaid account', (done) => {
//       request(app).patch('/billing/ICENP1502294786903/automatic-payment').send({
//         "enabled": true,
//         "paymentSource": "CREDITCARD",
//         "onDeclineSuspend": false,
//         "onDaysAvailable": {},
//         "creditCard": {
//           "cardType": "VISA",
//           "number": "5555666677779999",
//           "holder": "Mr John Doe",
//           "expMonth": "09",
//           "expYear": "2021",
//           "CVV": "599"
//         }
//       }).set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.equal(400);
//         expect(res.body).to.be.an('array');
//         expect(res.body).to.have.lengthOf(1);
//         done();
//       });
//     });
//     it('should fail due to missing required paymentSource property', (done) => {
//       request(app).patch('/billing/ICENP1502294786903/automatic-payment').send({
//         "enabled": true,
//         "onDeclineSuspend": false,
//         "creditCard": {
//           "cardType": "VISA",
//           "number": "5555666677779999",
//           "holder": "Mr John Doe",
//           "expMonth": "09",
//           "expYear": "2021",
//           "CVV": "599"
//         }
//       }).set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.equal(400);
//         expect(res.body).to.be.an('array');
//         expect(res.body).to.have.lengthOf(3);
//         done();
//       });
//     });
//     it('should patch payment configuration on a prepaid account', (done) => {
//       request(app).patch('/billing/ICENP1502838780753/automatic-payment').send({
//         "enabled": true,
//         "onDeclineSuspend": false,
//         "paymentSource": "CREDITCARD",
//         "creditCard": {
//           "cardType": "VISA",
//           "number": "4111111111111111",
//           "holder": "Mr John Doe",
//           "expMonth": "09",
//           "expYear": "2021",
//           "CVV": "599"
//         },
//         "onDaysAvailable": {
//           "enabled": true,
//           "trigger": 1,
//           "amount": 25.75
//         },
//         "onDayOfMonth": {
//           "enabled": false,
//           "trigger": 15,
//           "amount": 25.55
//         },
//         "onBalanceBelow": {
//           "enabled": false,
//           "trigger": 1,
//           "amount": 25.25
//         }
//       }).set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.oneOf([200, 302]);
//         expect(res.body.enabled).to.exist;
//         expect(res.body.paymentSource).to.exist;
//         expect(res.body.onDeclineSuspend).to.exist;
//         expect(res.body.onDaysAvailable).to.exist;
//         expect(res.body.onDayOfMonth).to.exist;
//         expect(res.body.onBalanceBelow).to.exist;
//         expect(res.body.creditCard).to.exist;
//         done();
//       });
//     });
//     it('should fail to patch payment configuration on a prepaid account due to missing required credit card number details', (done) => {
//       request(app).patch('/billing/ICENP1502838780753/automatic-payment').send({
//         "enabled": true,
//         "paymentSource": "CREDITCARD",
//         "onDeclineSuspend": false,
//         "onBalanceBelow": {
//           "enabled": false,
//           "trigger": 1,
//           "amount": 25.25
//         },        
//         "creditCard": {
//           "cardType": "VISA",
//           "holder": "Mr John Doe",
//           "expMonth": "09",
//           "expYear": "2021",
//           "CVV": "599"
//         }
//       }).set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.equal(400);
//         expect(res.body).to.be.an('array');
//         expect(res.body).to.have.lengthOf(3);
//         done();
//       });
//     });
//     it('should fail to patch payment configuration on any account due invalid payment Source', (done) => {
//       request(app).patch('/billing/ICENP1502838780753/automatic-payment').send({
//         "enabled": true,
//         "onDeclineSuspend": false,
//         "paymentSource": "VISACARD",
//         "onBalanceBelow": {
//           "enabled": false,
//           "trigger": 1,
//           "amount": 25.25
//         },         
//         "creditCard": {
//           "cardType": "VISA",
//           "number": "5555666677779999",
//           "holder": "Mr John Doe",
//           "expMonth": "09",
//           "expYear": "2021",
//           "CVV": "599"
//         }
//       }).set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.equal(400);
//         expect(res.body).to.be.an('array');
//         expect(res.body).to.have.lengthOf(2);
//         done();
//       });
//     });
//     it('should fail to patch payment configuration on a prepaid account due missing one of onDayOfMonth, onDaysAvailable, onBalanceBelow.', (done) => {
//       request(app).patch('/billing/ICENP1502838780753/automatic-payment').send({
//         "enabled": true,
//         "onDeclineSuspend": false,
//         "paymentSource": "CREDITCARD",
//         "creditCard": {
//           "cardType": "VISA",
//           "number": "5555666677779999",
//           "holder": "Mr John Doe",
//           "expMonth": "09",
//           "expYear": "2021",
//           "CVV": "599"
//         }
//       }).set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.equal(400);
//         expect(res.body).to.be.an('array');
//         expect(res.body).to.have.lengthOf(1);
//         done();
//       });
//     });
//     it('should fail to patch payment configuration on a prepaid account due missing properties of onDayOfMonth', (done) => {
//       request(app).patch('/billing/ICENP1502838780753/automatic-payment').send({
//         "enabled": true,
//         "onDeclineSuspend": false,
//         "paymentSource": "CREDITCARD",
//         "onDayOfMonth": {},
//         "creditCard": {
//           "cardType": "VISA",
//           "number": "5555666677779999",
//           "holder": "Mr John Doe",
//           "expMonth": "09",
//           "expYear": "2021",
//           "CVV": "599"
//         }
//       }).set('Authorization', 'Bearer 12345abcde.hello').end((err, res) => {
//         expect(res.statusCode).to.equal(400);
//         expect(res.body).to.be.an('array');
//         expect(res.body).to.have.lengthOf(6);
//         done();
//       });
//     });
//   });
// });
"use strict";

const NOCK_URL = "https://dev.iristelx.com"
const chai = require("chai");
const expect = chai.expect;
const request = require("supertest")(NOCK_URL);
const nock = require("nock");

describe("Accounts API Integration Tests", () => {
  describe("#GET / accounts", () => {
    it("should get all master accounts", done => {
      nock(NOCK_URL)
        .get('/accounts')
        .reply(200, {
          "accounts": [{
            "accountId": "9636515",
            "contact": {
              "fname": "Test",
              "lname": "Smith",
              "city": "Ivel",
              "province": "nu",
              "emailAddress": "test@gmail.com"
            },
            "status": "CLOSED"
          }]
        });

      request
        .get("/accounts")
        .set("Authorization", "Bearer 12345abcde.hello")
        .end((err, res) => {
          expect(res.statusCode).to.oneOf([200, 302]);
          expect(res.body.accounts).to.be.an("array");
          expect(res.body.accounts[0]).to.have.property('accountId');
          expect(res.body.accounts[0]).to.have.property('contact');
          expect(res.body.accounts[0]).to.have.property('status');
          expect(res.body.accounts[0]).to.have.nested.property('contact.fname');
          expect(res.body.accounts[0]).to.have.nested.property('contact.lname');
          expect(res.body.accounts[0]).to.have.nested.property('contact.city');
          expect(res.body.accounts[0]).to.have.nested.property('contact.province');
          expect(res.body.accounts[0]).to.have.nested.property('contact.emailAddress');
          done();
        });
    });
  });
  describe("#GET /:accountId specified master account", () => {
    it("should get a specified master account", done => {
      nock(NOCK_URL)
        .get('/accounts/ICENP1502838508900')
        .reply(200, {
          "status": "ACTIVE",
          "contact": {
            "fname": "Andreea",
            "lname": "Vasile",
            "address1": "34 Blvd Dacia",
            "address2": "",
            "address3": "",
            "city": "Craiova",
            "province": "BC",
            "postalCode": "L3R 0B8",
            "country": "CA",
            "emailAddress": "vasileandreea20+28@gmail.com"
          },
          "automaticPayment": {
            "enabled": false,
            "paymentType": "",
            "onDeclineSuspend": false,
            "creditCard": {
              "cardType": "",
              "last4digits": "",
              "holder": "",
              "expMonth": "",
              "expYear": ""
            },
            "onDaysAvailable": {
              "enabled": false,
              "trigger": null,
              "amount": null
            },
            "onDayOfMonth": {
              "enabled": false,
              "trigger": null,
              "amount": null
            },
            "onBalanceBelow": {
              "enabled": false,
              "trigger": null,
              "amount": null
            }
          }
        });
      request
        .get("/accounts/ICENP1502838508900")
        .set("Authorization", "Bearer 12345abcde.hello")
        .end((err, res) => {
          expect(res.statusCode).to.oneOf([200, 302]);
          expect(res.body).to.have.property('automaticPayment');
          expect(res.body).to.have.property('contact');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.nested.property('contact.fname');
          expect(res.body).to.have.nested.property('contact.lname');
          expect(res.body).to.have.nested.property('contact.city');
          expect(res.body).to.have.nested.property('contact.province');
          expect(res.body).to.have.nested.property('contact.emailAddress');
          expect(res.body).to.have.nested.property('contact.address1');
          expect(res.body).to.have.nested.property('contact.address2');
          expect(res.body).to.have.nested.property('contact.address3');
          expect(res.body).to.have.nested.property('contact.postalCode');
          expect(res.body).to.have.nested.property('contact.country');
          expect(res.body).to.have.nested.property('automaticPayment.enabled');
          expect(res.body).to.have.nested.property('automaticPayment.paymentType');
          expect(res.body).to.have.nested.property('automaticPayment.onDeclineSuspend');
          expect(res.body).to.have.nested.property('automaticPayment.creditCard');
          expect(res.body).to.have.nested.property('automaticPayment.onDaysAvailable');
          expect(res.body).to.have.nested.property('automaticPayment.onDayOfMonth');
          expect(res.body).to.have.nested.property('automaticPayment.onBalanceBelow');
          expect(res.body).to.have.nested.property('automaticPayment.creditCard.cardType');
          expect(res.body).to.have.nested.property('automaticPayment.creditCard.last4digits');
          expect(res.body).to.have.nested.property('automaticPayment.creditCard.holder');
          expect(res.body).to.have.nested.property('automaticPayment.creditCard.expMonth');
          expect(res.body).to.have.nested.property('automaticPayment.creditCard.expYear');
          expect(res.body).to.have.nested.property('automaticPayment.onDaysAvailable.enabled');
          expect(res.body).to.have.nested.property('automaticPayment.onDaysAvailable.trigger');
          expect(res.body).to.have.nested.property('automaticPayment.onDaysAvailable.amount');
          expect(res.body).to.have.nested.property('automaticPayment.onDayOfMonth.enabled');
          expect(res.body).to.have.nested.property('automaticPayment.onDayOfMonth.trigger');
          expect(res.body).to.have.nested.property('automaticPayment.onDayOfMonth.amount');
          expect(res.body).to.have.nested.property('automaticPayment.onBalanceBelow.enabled');
          expect(res.body).to.have.nested.property('automaticPayment.onBalanceBelow.trigger');
          expect(res.body).to.have.nested.property('automaticPayment.onBalanceBelow.amount');
          done();
        });
    });
  });
  // // describe('#POST / master account', () => {
  // //   it('should post/create a master account with valid contact parameter', (done) => {
  // //     request(app).post('/accounts')
  // //     .send({
  // //       "contact": {
  // //         "fname": "TEST",
  // //         "lname": "SID",
  // //         "address1": "30 Main Street",
  // //         "address2": "Unit 5",
  // //         "address3": "P.O. Box 29A",
  // //         "city": "Toronto",
  // //         "province": "ON",
  // //         "country": "CA",
  // //         "emailAddress": "sid@abc.com",
  // //         "postalCode": "M1M1M1"
  // //       }
  // //     })
  // //     .set('Authorization', 'Bearer 12345abcde.hello')
  // //       .end((err, res) => {
  // //         expect(res.statusCode).to.oneOf([200, 302]);
  // //         expect(res.body.accountId).to.exist;
  // //         expect(res.body.status).to.exist;
  // //         expect(res.body.contact).to.exist;
  // //         done();
  // //       });
  // //   });
  // // it('should fail to post/create a master account with invalid contact parameter', (done) => {
  // //   request(app).post('/accounts')
  // //   .send({
  // //     "contact": {
  // //       "fname": "",
  // //       "lname": "SID",
  // //       "address1": "30 Main Street",
  // //       "address2": "Unit 5",
  // //       "address3": "P.O. Box 29A",
  // //       "city": "Toronto",
  // //       "province": "ON",
  // //       "country": "CA",
  // //       "emailAddress": "sid@abc.com",
  // //       "postalCode": "M1M1M1"
  // //     }
  // //   })
  // //   .set('Authorization', 'Bearer 12345abcde.hello')
  // //     .end((err, res) => {
  // //       expect(res.statusCode).to.equal(400);
  // //       expect(res.body).to.be.an('array');
  // //       expect(res.body).to.have.lengthOf(1);
  // //       done();
  // //     });
  // // });
  // // });
  // // describe('#POST /:accountId/services service account', () => {
  // //   it('should post/create a service account with valid data', (done) => {
  // //     request(app).post('/accounts/ICENP1502838508900/services')
  // //     .send({
  // //       "provisioning": {
  // //         "planCode": "ICENP_FLEXDATA19"
  // //       },
  // //       "contact": {
  // //         "fname": "TEST",
  // //         "lname": "SID",
  // //         "address1": "30 Main Street",
  // //         "address2": "Unit 5",
  // //         "address3": "P.O. Box 29A",
  // //         "city": "Toronto",
  // //         "province": "ON",
  // //         "country": "CA",
  // //         "emailAddress": "sid@abc.com",
  // //         "postalCode": "M1M1M1"
  // //       }
  // //     })
  // //     .set('Authorization', 'Bearer 12345abcde.hello')
  // //       .end((err, res) => {
  // //         expect(res.statusCode).to.oneOf([200, 302]);
  // //         expect(res.body.serviceId).to.exist;
  // //         expect(res.body.status).to.exist;
  // //         expect(res.body.billing).to.exist;
  // //         expect(res.body.provisioning).to.exist;
  // //         expect(res.body.contact).to.exist;
  // //         done();
  // //       });
  // //   });
  // //   it('should fail to post/create a service account with invalid master account', (done) => {
  // //     request(app).post('/accounts/NO_GOOD_ACCOUNT/services')
  // //     .send({
  // //       "provisioning": {
  // //         "planCode": "ICENP_FLEXDATA19"
  // //       },
  // //       "contact": {
  // //         "fname": "TEST",
  // //         "lname": "SID",
  // //         "address1": "30 Main Street",
  // //         "address2": "Unit 5",
  // //         "address3": "P.O. Box 29A",
  // //         "city": "Toronto",
  // //         "province": "ON",
  // //         "country": "CA",
  // //         "emailAddress": "sid@abc.com",
  // //         "postalCode": "M1M1M1"
  // //       }
  // //     })
  // //     .set('Authorization', 'Bearer 12345abcde.hello')
  // //       .end((err, res) => {
  // //         expect(res.statusCode).to.equal(404);
  // //         expect(res.body).to.be.an('object');
  // //         expect(res.body.message).to.exist;
  // //         done();
  // //       });
  // //   });
  // //   it('should fail to post/create a service account with invalid plan code', (done) => {
  // //     request(app).post('/accounts/ICENP1502838508900/services')
  // //     .send({
  // //       "provisioning": {
  // //         "planCode": "NO_GOOD_PLAN"
  // //       },
  // //       "contact": {
  // //         "fname": "TEST",
  // //         "lname": "SID",
  // //         "address1": "30 Main Street",
  // //         "address2": "Unit 5",
  // //         "address3": "P.O. Box 29A",
  // //         "city": "Toronto",
  // //         "province": "ON",
  // //         "country": "CA",
  // //         "emailAddress": "sid@abc.com",
  // //         "postalCode": "M1M1M1"
  // //       }
  // //     })
  // //     .set('Authorization', 'Bearer 12345abcde.hello')
  // //       .end((err, res) => {
  // //         expect(res.statusCode).to.equal(400);
  // //         expect(res.body).to.be.an('array');
  // //         expect(res.body).to.have.lengthOf(1);
  // //         done();
  // //       });
  // //   });
  // // });
  // describe("#PATCH /:accountId master account", () => {
  //   it("should patch/update a master account with valid contact parameter", done => {
  //     request(app)
  //       .patch("/accounts/ICENP1502838508900")
  //       .send({
  //         contact: {
  //           fname: "TEST",
  //           lname: "SID",
  //           address1: "30 Main Street",
  //           address2: "Unit 5",
  //           address3: "P.O. Box 29A",
  //           city: "Toronto",
  //           province: "ON",
  //           country: "CA",
  //           emailAddress: "sid@abc.com",
  //           postalCode: "M1M1M1"
  //         }
  //       })
  //       .set("Authorization", "Bearer 12345abcde.hello")
  //       .end((err, res) => {
  //         expect(res.statusCode).to.oneOf([200, 302]);
  //         expect(res.body.status).to.exist;
  //         expect(res.body.contact).to.exist;
  //         done();
  //       });
  //   });
  //   it("should patch/update a master account with valid status parameter", done => {
  //     request(app)
  //       .patch("/accounts/ICENP1502838508900")
  //       .send({
  //         status: "active"
  //       })
  //       .set("Authorization", "Bearer 12345abcde.hello")
  //       .end((err, res) => {
  //         expect(res.statusCode).to.oneOf([200, 302]);
  //         expect(res.body.status).to.exist;
  //         expect(res.body.contact).to.exist;
  //         done();
  //       });
  //   });
  //   it("should patch/update a master account with valid status parameter", done => {
  //     request(app)
  //       .patch("/accounts/ICENP1502838508900")
  //       .send({
  //         status: "active "
  //       })
  //       .set("Authorization", "Bearer 12345abcde.hello")
  //       .end((err, res) => {
  //         expect(res.statusCode).to.oneOf([200, 302]);
  //         expect(res.body.status).to.exist;
  //         expect(res.body.contact).to.exist;
  //         done();
  //       });
  //   });
  //   it("should not patch/update a master account with invalid status parameter", done => {
  //     request(app)
  //       .patch("/accounts/ICENP1502838508900")
  //       .send({
  //         status: "nogood"
  //       })
  //       .set("Authorization", "Bearer 12345abcde.hello")
  //       .end((err, res) => {
  //         expect(res.statusCode).to.equal(400);
  //         expect(res.body).to.be.an("array");
  //         expect(res.body).to.have.lengthOf(1);
  //         done();
  //       });
  //   });
  //   it("should not patch/update a master account with invalid postal code parameter", done => {
  //     request(app)
  //       .patch("/accounts/ICENP1502838508900")
  //       .send({
  //         contact: {
  //           postalCode: "1234567"
  //         }
  //       })
  //       .set("Authorization", "Bearer 12345abcde.hello")
  //       .end((err, res) => {
  //         expect(res.statusCode).to.equal(400);
  //         expect(res.body).to.be.an("array");
  //         expect(res.body).to.have.lengthOf(1);
  //         done();
  //       });
  //   });
  //   it("should not patch/update a master account with invalid contact parameter", done => {
  //     request(app)
  //       .patch("/accounts/ICENP1502838508900")
  //       .send({
  //         contact: {
  //           lname: ""
  //         }
  //       })
  //       .set("Authorization", "Bearer 12345abcde.hello")
  //       .end((err, res) => {
  //         expect(res.statusCode).to.equal(400);
  //         expect(res.body).to.be.an("array");
  //         expect(res.body).to.have.lengthOf(1);
  //         done();
  //       });
  //   });
  // });
  // describe("#GET /:accountId/services service account", () => {
  //   it("should get service accounts for a specified master account", done => {
  //     request(app)
  //       .get("/accounts/ICENP1502838508900/services")
  //       .set("Authorization", "Bearer 12345abcde.hello")
  //       .end((err, res) => {
  //         expect(res.statusCode).to.oneOf([200, 302]);
  //         expect(res.body.services).to.exist;
  //         expect(res.body.services).to.be.an("array");
  //         done();
  //       });
  //   });
  // });
  // describe("#GET /:accountId/services/:serviceId service account", () => {
  //   it("should get a service account", done => {
  //     request(app)
  //       .get("/accounts/ICENP1502838508900/services/ICENP1502846727084")
  //       .set("Authorization", "Bearer 12345abcde.hello")
  //       .end((err, res) => {
  //         expect(res.statusCode).to.oneOf([200, 302]);
  //         expect(res.body.status).to.exist;
  //         expect(res.body.provisioning).to.exist;
  //         expect(res.body.billing).to.exist;
  //         expect(res.body.contact).to.exist;
  //         expect(res.body.automaticPayment).to.exist;
  //         done();
  //       });
  //   });
  // });
  // describe("#PATCH /:accountId/services/:serviceId service account", () => {
  //   it("should patch/update a service account with valid contact parameter", done => {
  //     request(app)
  //       .patch("/accounts/ICENP1502838508900/services/ICENP1502846727084")
  //       .send({
  //         contact: {
  //           fname: "TEST",
  //           lname: "SID",
  //           address1: "30 Main Street",
  //           address2: "Unit 5",
  //           address3: "P.O. Box 29A",
  //           city: "Toronto",
  //           province: "ON",
  //           country: "CA",
  //           emailAddress: "sid@abc.com",
  //           postalCode: "M1M1M1"
  //         }
  //       })
  //       .set("Authorization", "Bearer 12345abcde.hello")
  //       .end((err, res) => {
  //         expect(res.statusCode).to.oneOf([200, 302]);
  //         expect(res.body.status).to.exist;
  //         expect(res.body.provisioning).to.exist;
  //         expect(res.body.billing).to.exist;
  //         expect(res.body.contact).to.exist;
  //         done();
  //       });
  //   });
  // });
});
// "use strict";

// const app = require("./../../bin/www");
// const chai = require("chai");
// const request = require("supertest");
// const nock = require('nock');
// const expect = chai.expect;

// describe('Porting API Integration Tests', () => {
//   describe('#GET /check validate if number is portable', () => {
//     it('should validate that the number is portable', (done) => {
//       request(app).get('/porting/check').set('Authorization', 'Bearer 12345abcde.hello').query({
//         areaCode: '867',
//         exchangeCode: '333'
//       }).end((err, res) => {
//         expect(res.statusCode).to.oneOf([200, 302]);
//         expect(res.body.isPortable).to.exist;
//         expect(res.body.isPortable).to.equal(true);
//         done();
//       });
//     });
//     it('should validate that the number is not portable', (done) => {
//       request(app).get('/porting/check').set('Authorization', 'Bearer 12345abcde.hello').query({
//         areaCode: '555',
//         exchangeCode: '333'
//       }).end((err, res) => {
//         expect(res.statusCode).to.oneOf([500]);
//         done();
//       });
//     });
//   });
// });
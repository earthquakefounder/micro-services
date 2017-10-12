const express = require('express');
const app = express();
const chai = require('chai');
const http = require('chai-http');
const should = chai.should();

const router = require('../index');

app.use(router);
chai.use(http);

describe('Timetracking', () => {
    it('should return object', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                console.log(res);
                done();
            });
    })
})


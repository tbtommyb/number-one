'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var should = require('should'),
    expect = require('expect'),
    supertest = require('supertest'),
    request = supertest('https://127.0.0.1:3443/api'),
    db = require('../app/server/db.js')();

// TO DO: adding tests for using wrong HTTP verb
// pull in real token and real variable from config file on .gitignore

var realToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJudW1iZXItb25lLWFwcCIsIm5hbWUiOiJhZG1pbiIsImFkbWluIjoidHJ1ZSJ9.99lt5BjGarA5rwa4BQNl-xL8R2BZFIzPw4y-BG8_b0U';

describe('GET /api', function () { 

    it('should return a 200 response and say hello', function (done) {
        request
            .get('/')
            .expect('Content-Type', /json/)
            .expect(200, {
                message: 'hello!'
            }, done);
    });
});

describe('Requiring basic auth details to be present', function (done) {
    
    it('should return a 401 error if no auth in header', function (done) {
        request
            .post('/register')
            .end(function (err, res) {
                should.not.exist(err);
                res.status.should.equal(401);
                should.exist(res.headers['www-authenticate']);
                done();
            });
    });
    it('should return a 401 error if username is empty string', function (done) {
        request
            .post('/register')
            .auth('', 'testpass')
            .expect(401, done);
    });
});

describe('POST a new user', function () {

    it('should return a 201 (content created) message when details are provided', function (done) {
        request
            .post('/register')
            .auth('tester3', 'testpass')
            .expect(201, done);
    });
    it('should return a 401 error if password is empty string', function (done) {
        request
            .post('/register')
            .auth('tester2', '')
            .expect(401, done);
    });
    it('should return a 409 error if the user already exists in DB', function (done) {
        request
            .post('/register')
            .auth('tester3', 'testpass')
            .expect(409, done);
    });
    after(function() {
        db.run("DELETE FROM Users WHERE name LIKE 'tester%'");
    });
});

describe('POST details to login', function () {

    it('should return a 404 if username not found', function (done) {
        request
            .post('/login')
            .auth('admin2', 'horsey56')
            .expect(404, done);
    });
    it('should return a 401 if password is incorrect', function (done) {
        request
            .post('/login')
            .auth('admin', 'horsey6')
            .expect(401, done);
    });
    it('should return a 401 error if password is empty string', function (done) {
        request
            .post('/login')
            .auth('admin', '')
            .expect(401, done);
    });
    it('should return a 200 and a token if details are correct', function (done) {
        request
            .post('/login')
            .auth('admin', 'horsey56')
            .end(function (err, res) {
                should.not.exist(err);
                res.status.should.equal(200);
                should.exist(res.body.token);
                if (err) {
                    return done(err);
                }
                done();              
            });
    });
    after(function() {
        db.run("DELETE FROM Users WHERE name LIKE 'tester%'");
    });
});

describe('Token checker', function () {

    it('should return a 403 if a token is not provided', function (done) {
        request
            .get('/records')
            .auth('admin', 'horsey56')
            .expect(403, done);
    });
    it('should return a 400 if the token is invalid', function (done) {
        request
            .get('/records')
            .auth('admin', 'horsey56')
            .set('x-access-token', 'EyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJudW1iZXItb25lLWFwcCIsIm5hbWUiOiJhZG1pbiIsImFkbWluIjoidHJ1ZSJ9.99lt5BjGarA5rwa4BQNl-xL8R2BZFIzPw4y-BG8_b0U')
            .expect(400, done);
    });
    it('should return a 403 if the token has a different name', function (done) {
        request
            .get('/records')
            .auth('admin', 'horsey56')
            .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJudW1iZXItb25lLWFwcCIsIm5hbWUiOiJ0b20iLCJhZG1pbiI6InRydWUifQ.EURon1HHzSL4ReoYq5ZwnfBvIeC7_t1ZPxiGjpXFpA4')
            .expect(403, done);
    });
    it('should return a 200 if the token is valid', function (done) {
        request
            .get('/records')
            .auth('admin', 'horsey56')
            .set('x-access-token', realToken)
            .expect(200, done);
    });
});

describe('Getting records', function () {

    it('should return 200 and a lot of JSON', function (done) {
        request
            .get('/records')
            .auth('admin', 'horsey56')
            .set('x-access-token', realToken)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.body.length.should.be.above(500);
                done();
            });            
    });

    it('should return 200 and the correct artist and title info', function (done) {
        request
            .get('/records/1988-12-27')
            .auth('admin', 'horsey56')
            .set('x-access-token', realToken)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.body.length.should.equal(1);
                console.log(res);
                //res.body.artist.should.equal('CLIFF RICHARD');
                done();
                // check actual names
            });

    });

    it('should return 400 bad request with an invalid date string');
});
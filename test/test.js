'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var should = require('should'),
    expect = require('expect'),
    supertest = require('supertest'),
    request = supertest('https://127.0.0.1:3443/api'),
    config = require('./config.js'),
    db = require('../app/server/db.js')();

// TO DO: adding tests for using wrong HTTP verb
// pull in real token and real variable from config file on .gitignore

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
            .auth('admin2', config.password)
            .expect(404, done);
    });
    it('should return a 401 if password is incorrect', function (done) {
        request
            .post('/login')
            .auth('admin', 'ddfgfshgs')
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
            .auth('admin', config.password)
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
            .auth('admin', config.password)
            .expect(403, done);
    });
    it('should return a 400 if the token is invalid', function (done) {
        request
            .get('/records')
            .auth('admin', config.password)
            .set('x-access-token', 'EyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJudW1iZXItb25lLWFwcCIsIm5hbWUiOiJhZG1pbiIsImFkbWluIjoidHJ1ZSJ9.99lt5BjGarA5rwa4BQNl-xL8R2BZFIzPw4y-BG8_b0U')
            .expect(400, done);
    });
    it('should return a 403 if the token has a different name', function (done) {
        request
            .get('/records')
            .auth('admin', config.password)
            .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJudW1iZXItb25lLWFwcCIsIm5hbWUiOiJ0b20iLCJhZG1pbiI6InRydWUifQ.EURon1HHzSL4ReoYq5ZwnfBvIeC7_t1ZPxiGjpXFpA4')
            .expect(403, done);
    });
    it('should return a 200 if the token is valid', function (done) {
        request
            .get('/records')
            .auth('admin', config.password)
            .set('x-access-token', config.token)
            .expect(200, done);
    });
});

describe('Getting records', function () {

    it('should return 200 and a lot of JSON', function (done) {
        request
            .get('/records')
            .auth('admin', config.password)
            .set('x-access-token', config.token)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.body.length.should.be.above(500);
                done();
            });            
    });
    it('should return 200 and the correct artist info', function (done) {
        request
            .get('/records/1988-12-27')
            .auth('admin', config.password)
            .set('x-access-token', config.token)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.body.artist.should.equal('CLIFF RICHARD');
                done();
            });

    });
    it('should return 400 bad request with an invalid date string');
});

describe('Admin', function () {
    it('authorised users should be allowed through');
    it('non-authorised users should not be allow through');
    it('status must be in the token');
});

describe('GET /users', function () {
    it('should return 200 and a list of users');
    it('should get the right user by name');
    it('should return an error if an incorrect name is provided');
    it('non-admin users should be able to access their own details');
});

describe('PUT /users', function () {
    it('should require a name url param');
    it('should require at least one param in the req body');
    it('should encrypt any passwords provided');
    it('should return an error if the user does not exist');
    it('should return which code if the update is successful');
    it('should return an error if details provided are invalid');
});

describe('DEL /users', function () {
    it('should return an error code if no username param provided');
    it('should return an error if user does not exist');
    it('should return 200 ok if user deleted');
});

describe('POST /records', function () {
    it('should return an error if no date provided');
    it('should return an error if invalid date provided');
    it('should return an error if params are invalid');
    it('should return 200 if record created ok');
    it('should return an error if the date is already taken');
});

describe('DEL /records', function () {
    it('should return an error code if no date is provided');
    it('should return an error if the date does not exist in db');
    it('should return 200 ok if the record is deleted');
});

describe('POST /records', function () {
    it('should require a rowid url param');
    it('should require at least one param in the req body');
    it('should return an error if the rowid does not exist');
    it('should return which code if the update is successful');
    it('should return an error if details provided are invalid');   
});
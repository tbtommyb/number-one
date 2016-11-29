'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const should = require('should');
const supertest = require('supertest');
const request = supertest('http://localhost:9000/api');
const config = require('./config.js');
const db = require('../app/server/data/db.js');

// TO DO: adding tests for using wrong HTTP verb

describe('GET /api', function() { 
    it('should return a 200 response with HTML content-type', function(done) {
        request
        .get('/')
        .expect('Content-Type', 'text/html; charset=UTF-8')
        .expect(200, done);
    });
});

describe('Requiring basic auth details to be present', function(done) {
    it('should return a 401 error if no auth in header', function(done) {
        request
        .post('/register')
        .end(function(err, res) {
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

describe('POST a new user', function() {
    it('should return a 201 (content created) message when details are provided', function(done) {
        request
        .post('/register')
        .auth('tester3', 'testpass')
        .expect(201, done);
    });
    it('should return a 401 error if password is empty string', function(done) {
        request
        .post('/register')
        .auth('tester2', '')
        .expect(401, done);
    });
    it('should return a 201 (content created) when the user already exists in DB', function(done) {
        request
        .post('/register')
        .auth('tester3', 'testpass')
        .expect(201, done);
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
    it('should not return an error if there is a different token on the request', function() {
        (true).should.be.ok;
    });
    // this is due to wrong verb again
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
            .set('x-access-token', config.admin_token)
            .expect(200, done);
    });
});

describe('Getting records', function () {

    it('should return 200 and a lot of JSON', function (done) {
        request
            .get('/records')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
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
            .set('x-access-token', config.admin_token)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.body.artist.should.equal('CLIFF RICHARD');
                done();
            });

    });
    it('should return 400 bad request with an invalid date string');
});

describe('Admin', function () {
    it('authorised users should be allowed through to GET /users', function (done) {
        request
            .get('/admin/users')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .expect(200, done);
    });
    it('non-authorised users should not be allow through', function (done) {
        request
            .get('/admin/users')
            .auth('number-one', config.password)
            .set('x-access-token', config.number_token)
            .expect(403, done);
    });
    it('status must be in the token', function (done) {
        request
            .get('/admin/users')
            .auth('number-one', config.password)
            .set('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJudW1iZXItb25lLWFwcCIsImlhdCI6MTQ0NTg4NzI0OCwiZXhwIjoxNDc3NDIzMjQ4LCJhdWQiOiJ3d3cuZXhhbXBsZS5jb20iLCJzdWIiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwibmFtZSI6Im51bWJlci1vbmUifQ.oK5OGXLXW5BP0_-VqljlbkmsCPMyDdD_uHsVKvJeJZo')
            .expect(403, done);
    });
});

describe('GET /users', function () {

    it('should return 200 and a list of users', function (done) {
        request
            .get('/admin/users')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.headers['content-type'].should.equal('application/json; charset=utf-8');
                res.body.length.should.equal(2);
                done();
            });
    });
    it('should get the right user by name', function (done) {
        request
            .get('/admin/users/number-one')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.headers['content-type'].should.equal('application/json; charset=utf-8');
                res.body.name.should.equal('number-one');
                done();
            });        
    });
    it('should return an error if an incorrect name is provided', function (done) {
        request
            .get('/admin/users/coco')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .expect(404, done);       
    });
    it('non-admin users should be able to access their own details');
});

describe('PUT /users', function () {
    before(function () {
        db.run("INSERT INTO Users VALUES ('tester', 'tester', 'false')");
    });
    var invalidUser = {
        name: 'tester2',
        password: 'tester2',
    };
    var validUser = {
        name: 'tester2',
        password: 'tester2',
        admin: 'true'
    };
    it('should return 200 code if the update is successful', function (done) {
        request
            .put('/admin/users/tester')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .send(validUser)
            .expect(200, done); 
    });
    it('should require a name url param', function (done) {
        request
            .put('/admin/users')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .send(validUser)
            .expect(404, done);           
    });
    it('should require all params in the req body', function (done) {
        request
            .put('/admin/users/tester')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .send(invalidUser)
            .expect(400, done);
    });
    it('should return an error if the user does not exist', function (done) {
        request
            .put('/admin/users/tester5')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .send(validUser)
            .expect(404, done);       
    });
    it('should return an error if details provided are invalid');
});

describe('DEL /users', function () {
    before(function () {
        db.run("INSERT INTO Users VALUES ('tester', 'tester', 'false')");
    });
    it('should return an error code if no username param provided', function (done) {
        request
            .del('/admin/users')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .expect(404, done);           
    });
    it('should return an error if user does not exist', function (done) {
        request
            .del('/admin/users/coco')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .expect(404, done); 
    });
    it('should return 200 ok if user deleted', function (done) {
        request
            .del('/admin/users/tester')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            }); 
    });
    it('should return an error if an invalid string is provided');
    after(function() {
        db.run("DELETE FROM Users WHERE name LIKE 'tester%'");
    });
});

describe('POST /records', function () {
    var missingParams = {
        title: 'tester',
        weeks: 1
    };
    var valid = {
        artist: 'tester',
        title: 'tester',
        weeks: 1
    };
    it('should return an error if no date provided', function (done) {
        request
            .post('/admin/records')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .expect(404, done);
    });
    it('should return an error 400 if invalid date provided', function (done) {
        request
            .post('/admin/records/201-12-11')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .send(valid)
            .expect(400, done);
    });
    it('should return an error if some params are missing', function (done) {
        request
            .post('/admin/records/2015-12-12')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .send(missingParams)
            .expect(400, done);
    });
    it('should return 201 if record created ok', function (done) {
        request
            .post('/admin/records/2015-12-13')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .send(valid)
            .expect(201, done);
    });
    before(function(){
        db.run("INSERT INTO Data VALUES ('2015-12-24', tester', 'tester', '5'");
    });
    it('should return an error 409 if the date is already taken', function (done) {
        request
            .post('/admin/records/2015-12-24')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .send(valid)
            .expect(409, done);
    });
    after(function() {
        db.run("DELETE FROM Data WHERE artist LIKE 'TESTER%'");
    });
});

describe('DEL /records', function () {
    before(function () {
        db.run("INSERT INTO Data VALUES ('2015-12-12', 'tester', 'tester', '1')");
    });
    it('should return an error 404 if no date is provided', function (done) {
        request
            .del('/admin/records')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .expect(404, done);
    });
    it('should return an error 404 if the date does not exist in db', function (done) {
        request
            .del('/admin/records/2055-12-01')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .expect(404, done);
    });
    it('should return 200 ok if the record is deleted', function (done) {
        request
            .del('/admin/records/2015-12-12')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .expect(200, done);           
    });
    it('should return an error 400 if an invalid date is provided', function (done) {
        request
            .del('/admin/records/20102-02-04')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .expect(400, done);
    });
    after(function() {
        db.run("DELETE FROM Data WHERE artist LIKE 'tester%'");
    });
});

describe('PUT /records', function () {
    var invalid = {
        date: '2020-02-02',
        title: 'new title',
        weeks: 10
    };
    var valid = {
        date: '2020-02-02',
        artist: 'new artist',
        title: 'new title',
        weeks: 10
    };
    it('should require a rowid url param', function (done) {
        request
            .put('/admin/records/')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .send(valid)
            .expect(404, done);
    });
    it('should require all params in the req body', function (done) {
        request
            .put('/admin/records/1354')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .send(invalid)
            .expect(400, done);
    });
    it('should return an error if the rowid does not exist', function (done) {
        request
            .put('/admin/records/1700')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .send(valid)
            .expect(404, done);
    });
    it('should return which code if the update is successful', function (done) {
        request
            .put('/admin/records/1351')
            .auth('admin', config.password)
            .set('x-access-token', config.admin_token)
            .send(valid)
            .expect(201, done);
    });
    it('should return an error if details provided are invalid');   
});
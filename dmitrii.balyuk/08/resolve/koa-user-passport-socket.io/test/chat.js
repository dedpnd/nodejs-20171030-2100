'use strict';

const request = require('request');
const server = require('../index');
const chai = require('chai');
const assert = chai.assert;
chai.should();

describe("server", function() {
    let app = null;

    before((done) => {
        app = server.listen(3001, () => {
            console.log("server started:3001");
            done();
        })
    })

    after((done) => {
        app.close(() => {
            console.log("server closed!")
            done()
        })
    })

    describe("POST /publish", function() {

        it("sends a message to all subscribers", function(done) {

            let count = -1;
            const message = "text";

            while (++count < 2) {
                request({
                    method: 'GET',
                    url: 'http://127.0.0.1:3000/subscribe',
                    timeout: 100
                }, function(err, response, body) {
                    // expect timeout (no message) after 100ms
                    if (err) done(err);
                    body.should.be.eql(message);
                    if (--count == 0) done();
                });
            }

            request({
                method: 'POST',
                url: 'http://127.0.0.1:3000/publish',
                json: true,
                body: {
                    message
                }
            }, function(err, response, body) {
                // ignore the POST response unless error
                if (err) done(err);
            });


        });


        context("when body is too big", function() {

            it("ignores the message", function(done) {
                request({
                    method: 'GET',
                    url: 'http://127.0.0.1:3000/subscribe',
                    timeout: 100
                }, function(err, response, body) {
                    // expect timeout (no message) after 100ms
                    assert.equal((err && err.code), 'ETIMEDOUT');
                    done();
                });

                request({
                    method: 'POST',
                    url: 'http://127.0.0.1:3000/publish',
                    json: true,
                    body: {
                        message: "*".repeat(1e4)
                    }
                }, function(err, response, body) {
                    // ignore the POST response unless error
                    if (err) done(err);
                });

            });


            it("returns 413", function(done) {
                request({
                    method: 'POST',
                    url: 'http://127.0.0.1:3000/publish',
                    body: "*".repeat(1e4)
                }, function(err, response, body) {
                    if (err) return done(err);

                    response.statusCode.should.be.eql(413);

                    done();

                });
            });
        });



    });

});
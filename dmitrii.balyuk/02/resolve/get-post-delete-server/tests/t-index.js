const server = require('../index');
const fs = require('fs');
const axios = require('axios');
const assert = require('assert');
const path = require('path');

describe('server.js test', function() {
    /**For big file */
    this.timeout(15000);

    let app;
    before((done) => {
        app = server.listen(3001, () => {
            console.log("server start localhost:3001")
            done();
        })
    })

    after((done) => {
        app.close(() => {
            done();
        })
    })

    describe('GET request', () => {
        let getFile = 'test.txt';

        it('should return' + getFile, (done) => {
            let content = fs.readFileSync(path.join(__dirname, '../', 'files', getFile));

            axios('http://localhost:3001/' + getFile).then((res) => {
                if (res.status != 200) {
                    assert.throws(() => {
                        throw new Error(error)
                    }, Error)
                    return
                }
                assert.equal(res.data, content);
            }).then(() => {
                done();
            }).catch((error) => {
                done(error);
            })
        })
    })

    describe('POST request', () => {
        let postFile = 'test_file.txt',
            pathToFile = path.join(__dirname, '../', 'files', postFile);

        before(() => {
            if (fs.existsSync(pathToFile)) {
                fs.unlinkSync(pathToFile)
            }
        })

        after(() => {
            if (fs.existsSync(pathToFile)) {
                fs.unlinkSync(pathToFile)
            }
        })

        it('shold post ' + postFile, (done) => {
            let content = fs.readFileSync(path.join(__dirname, 'files', postFile));

            axios.post('http://localhost:3001/' + postFile, content).then((res) => {
                if (res.status != 200) {
                    assert.throws(() => {
                        throw new Error(error)
                    }, Error)
                    return
                }
                done()
            }).catch((error) => {
                done(error)
            })
        })
    })

    describe('DELETE request', () => {
        let deleteFile = 'test_file.txt',
            content = fs.readFileSync(path.join(__dirname, 'files', deleteFile));

        before((done) => {
            axios.post('http://localhost:3001/' + deleteFile, content).then((res) => {
                if (res.status != 200) {
                    assert.throws(() => {
                        throw new Error(error)
                    }, Error)
                    return
                }
                done()
            })
        })

        it('should delete ' + deleteFile, (done) => {
            axios({
                url: 'http://localhost:3001/' + deleteFile,
                method: 'DELETE'
            }).then((res) => {
                if (res.status != 200) {
                    assert.throws(() => {
                        throw new Error(error)
                    }, Error)
                    return
                }
                done()
            }).catch((error) => {
                done(error)
            })
        })

    })
})
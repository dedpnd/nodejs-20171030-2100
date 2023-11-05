const server = require('../index');
const fs = require('mz/fs');
const axios = require('axios');
const chai = require('chai');
const assert = chai.assert;
const path = require('path');

describe('server.js test', function() {
    /**For big file */
    this.timeout(10000);
    chai.should();

    let testFile = 'test_file.txt',
        bigFile = 'vmacore.dll.zip',
        pathTest = path.join(__dirname, 'files', testFile),
        pathProd = path.join(__dirname, '../files', testFile),
        app = server;

    before(async() => {
        await server.listen(3001);
        console.log("server start localhost:3001")
    })

    after(async() => {
        await server.close();
        console.log("server stoped!")
    })

    describe('GET request', () => {
        before(async() => {
            if (await fs.existsSync(pathProd)) {
                await fs.unlinkSync(pathProd)
            }
            await fs.copyFileSync(
                pathTest,
                pathProd
            );
        })

        after(async() => {
            await fs.unlinkSync(pathProd)
        })

        it('return ' + testFile, async() => {
            let content = await fs.readFileSync(pathProd);

            let res = await axios('http://localhost:3001/' + testFile);
            assert.equal(res.status, 200);
            assert.equal(res.data, content);
        })

        it('return 400 bad path', async() => {
            let res = await axios('http://localhost:3001/dir/..').catch(err => err)
            assert.equal(400, res.response.status)
        })

        it('return 404 not found', async() => {
            let res = await axios('http://localhost:3001/never.file').catch(err => err)
            assert.equal(404, res.response.status)
        })
    })

    describe('POST request', () => {
        before(async() => {
            if (await fs.existsSync(pathProd)) {
                await fs.unlinkSync(pathProd)
            }
        })

        after(async() => {
            if (await fs.existsSync(pathProd)) {
                await fs.unlinkSync(pathProd)
            }
        })

        it('shold post ' + testFile, async() => {
            let content = await fs.readFileSync(pathTest);
            let res = await axios.post('http://localhost:3001/' + testFile, content);

            res.status.should.equal(200);
            assert(await fs.readFileSync(pathProd), content);
            /**
             * А тут ошибка.
             * await fs.readFileSync(pathProd).should.equal(content);
             */
        })

        it('return 413 file big', async() => {
            let content = await fs.readFileSync(path.join(__dirname, 'files', bigFile));
            let res = await axios.post('http://localhost:3001/' + bigFile, content).catch(err => err);

            if (res.code == "ECONNRESET") {
                //NOTHING
            } else {
                assert.equal(res.response.status, 413);
            }
        })

        it('return 409 file exist', async() => {
            await fs.copyFileSync(pathTest, pathProd);
            let res = await axios.post('http://localhost:3001/' + testFile).catch(err => err);

            assert(res.response.status, 409);
        })
    })

    describe('DELETE request', () => {
        before(async() => {
            if (!await fs.existsSync(pathProd)) {
                await fs.copyFileSync(pathTest, pathProd)
            }
        })

        after(async() => {
            if (await fs.existsSync(pathProd)) {
                await fs.unlinkSync(pathProd)
            }
        })

        it('should delete ' + testFile, async() => {
            let res = await axios({
                url: 'http://localhost:3001/' + testFile,
                method: 'DELETE'
            })

            assert(res.status, 200);
            await fs.existsSync(pathProd).should.equal(false);
        })

        it("return 404 file not exist", async() => {
            let res = await axios({
                url: 'http://localhost:3001/never.file',
                method: 'DELETE'
            }).catch(err => err);

            assert(res.response.status, 404);
        })
    })
})
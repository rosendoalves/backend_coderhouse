const chai = require("chai")
const supertest = require("supertest")

const expect = chai.expect
const requester = supertest('http://localhost:3001')

describe('Testing aplicación Coder', () => {
    describe('Test de productos 1', () => {
        it('GET de productos debe devolver el payload', async () => {
            const {_body, status} = await requester.get('/api/products')
            expect(_body).to.have.property('payload')
            expect(status).is.equal(200)
        })
    })
})
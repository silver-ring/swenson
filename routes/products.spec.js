const request = require('supertest')
const { MongoClient } = require('mongodb')
const { v4: generateId } = require('uuid')
const Chance = require('chance')
const app = require('../app')

jest.mock('../services/database')
const database = require('../services/database')

const chance = new Chance()

function generateProduct() {
    return {
        _id: generateId(),
        sku: chance.name(),
        productType: chance.name(),
        productDescription: chance.sentence(),
        waterLine: chance.bool(),
        coffeeFlavor: chance.name(),
        packSize: chance.pickone([3, 5, 7]),
        productCategory: chance.pickone(['COFFEE_MACHINE', 'POD'])
    }
}

describe('get /products', () => {

    let connection
    let db

    const productsFixturePage1 = []
    const productsFixturePage2 = []
    const productsFixturePage3 = []
    let allProducts

    beforeAll(async () => {
        connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
        })
        db = await connection.db(global.__MONGO_DB_NAME__)
        database.client = {
            db: jest.fn(() => db),
        }
        for (let i = 0; i < 20; i++) {
            productsFixturePage1.push(generateProduct())
        }
        for (let i = 0; i < 20; i++) {
            productsFixturePage2.push(generateProduct())
        }
        for (let i = 0; i < 15; i++) {
            productsFixturePage3.push(generateProduct())
        }
        const products = db.collection('products')
        allProducts = [...productsFixturePage1, ...productsFixturePage2, ...productsFixturePage3]
        await products.insertMany(allProducts)
    })

    afterAll(async () => {
        await connection.close()
        await db.close()
    })

    it('should filter by product category',  (done) => {
        const productCategory = allProducts[0].productCategory
        const url = `/products?productCategory=${productCategory}`
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                const expectedProducts = allProducts
                    .filter(product => product.productCategory === productCategory)
                    .slice(0, 20)
                expect(response.body).toEqual(expectedProducts)
                done()
            })
            .catch((err) => done(err))
    })

    it('should filter by product category and product type',  (done) => {
        const productCategory = allProducts[0].productCategory
        const productType = allProducts[0].productType
        const url = `/products?productCategory=${productCategory}&productType=${productType}`
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                const expectedProducts = allProducts
                    .filter(product => product.productType === productType
                        && product.productCategory === productCategory)
                    .slice(0, 20)
                expect(response.body).toEqual(expectedProducts)
                done()
            })
            .catch((err) => done(err))
    })

    test('should return page if page is on query parameter', async (done) => {
        const url = `/products?page=2`
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(productsFixturePage2)
                done()
            })
            .catch((err) => done(err))
    })

    test('should return remaining products if page is less than 20', async (done) => {
        const url = `/products?page=3`
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(productsFixturePage3)
                done()
            })
            .catch((err) => done(err))
    })

    test('should return empty response if page exceed total page', async (done) => {
        const url = `/products?page=4`
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual([])
                done()
            })
            .catch((err) => done(err))
    })

    test('should return empty response if page less than one', async (done) => {
        const url = `/products?page=0`
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual([])
                done()
            })
            .catch((err) => done(err))
    })

    test('should return 10 products if limit is 10', async (done) => {
        const url = `/products?limit=10`
        request(app)
            .get(url)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(productsFixturePage1.slice(0, 10))
                done()
            })
            .catch((err) => done(err))
    })

})

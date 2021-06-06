const express = require('express')
const router = express.Router()
const database = require('../services/database');

router.post('/', async (req, res) => {
  const db = database.client.db('swenson');
  const products = db.collection('products');

  products.insert(req.body)
  res.status(200)
  res.send("product created")
})

router.get('/', async (req, res) => {

  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 20);
  const skip = (page - 1) * limit;
  if (skip < 0) {
    res.status(200);
    res.json([]);
  } else {

    const product = {
      productType: req.query.productType,
      waterLine: req.query.waterLine,
      coffeeFlavor: req.query.coffeeFlavor,
      packSize: req.query.packSize,
      productCategory: req.query.productCategory
    }

    // clean product from null values
    let queryObj = Object.fromEntries(Object.entries(product).filter(([_, v]) => v != null));

    const db = database.client.db('swenson');
    const products = db.collection('products');

    const response = await products.find(queryObj).skip(skip).limit(limit).toArray();
    res.status(200);
    res.json(response);
  }

});

module.exports = router

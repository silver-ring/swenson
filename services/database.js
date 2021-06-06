const { MongoClient } = require('mongodb');

const database = module.exports;

database.connect = async function connect() {
  database.client = await MongoClient.connect(process.env.DATABASE_URL, { useUnifiedTopology: true });
};

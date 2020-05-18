const MongoClient = require("mongodb").MongoClient;

const makeDb = async () => {
  const url = "mongodb://localhost:27017/olx_mailer";
  const dbName = "olx_mailer";
  const client = new MongoClient(url, { useNewUrlParser: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    return db;
  } catch (err) {
    console.log(err.stack);
  }
};
module.exports = makeDb;

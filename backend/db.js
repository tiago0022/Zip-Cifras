
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://tiago0022:19712021@zipcifrascluster.jfjsoz8.mongodb.net/?retryWrites=true&w=majority&appName=ZipCifrasCluster";
const dbName = "zip_cifras";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

run().catch(console.dir);

function getDatabase() {
    return client.db(dbName);
}

module.exports = { run, client, getDatabase };


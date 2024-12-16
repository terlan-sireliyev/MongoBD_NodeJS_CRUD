import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = "mongodb+srv://node02:node02pwd@node02-cluster.02oek.mongodb.net/?retryWrites=true&w=majority&appName=node02-cluster";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
client.connect().then(() => {
    console.log("connect mongodb successfully")
});

export default client;

 
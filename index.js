const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


//MongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dmqu4oo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        //database & collection
        const database = client.db("bistroDB");
        const menuCollection = database.collection("menu");
        const reviewsCollection = database.collection("reviews");
        const cartsCollection = database.collection("carts");

        // Get all menu
        app.get("/menu", async (req, res) => {
            const cursor = menuCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // Get all reviews
        app.get("/reviews", async (req, res) => {
            const cursor = reviewsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        //Api for carts

        //add something to cart collection
        app.post('/carts', async (req, res) => {
            const item = req.body;
            console.log(item);
            const result = await cartsCollection.insertOne(item);
            res.send(result);
        })

        //get from cart collection
        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send([]);
            }
            else {
                const query = { email: email };
                const result = await cartsCollection.find(query).toArray();
                res.send(result);
            }
        })

        //delete from cart collection
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartsCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Boss is sitting');
})

app.listen(port, () => {
    console.log(`Bistro Boss is sitting on Port ${port}`);
})

/**
 * --------------------------------
 *      NAMING CONVENTION
 * --------------------------------
 * users : userCollection
 * app.get('/users')
 * app.get('/users/:id')
 * app.post('/users')
 * app.patch('/users/:id')
 * app.put('/users/:id')
 * app.delete('/users/:id')
*/
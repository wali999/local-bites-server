const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e8hxcyy.mongodb.net/?appName=Cluster0`;

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
        await client.connect();

        const db = client.db('localbites-db')
        const reviewCollection = db.collection('reviews')

        //get method for All Reviews page
        app.get('/allReviews', async (req, res) => {
            const result = await reviewCollection.find().toArray()
            res.send(result)
        })

        //Get method for Food View details page
        app.get('/allReviews/:id', async (req, res) => {
            const { id } = req.params
            const result = await reviewCollection.findOne({ _id: new ObjectId(id) })
            // res.send(result)
            res.send({ success: true, result })
        })

        //get method for Top Reviews in Home page
        app.get('/topReviews', async (req, res) => {
            const result = await reviewCollection.find().sort({ rating: -1 }).limit(6).toArray()
            res.send(result)
        })

        //get Method for My Reviews
        app.get('/myReviews', async (req, res) => {
            const email = req.query.email;
            const query = {};
            if (email) {
                query.email = email;
            }
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        //Post method for Add Review
        app.post('/addReview', async (req, res) => {
            const data = req.body
            const result = await reviewCollection.insertOne(data)
            res.send(result)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running!')
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})

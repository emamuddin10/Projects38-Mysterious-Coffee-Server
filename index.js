const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// middleware 
app.use(cors())
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('Mysterious coffee is cocking')
})

app.listen(port, ()=>{
    console.log(`The coffee is cocking is port : ${port}`)
})

// coffeeMaster
// bKDomqu71WPiR0s7
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v28xn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


console.log(uri)
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

    const coffeeCollection = client.db('coffeeDB').collection('coffee')

    // get 
    app.get('/coffee',async(req,res)=>{
      const cursor = coffeeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    // get api for update 
    app.get('/coffee/:id',async(req,res)=>{
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })

    // post 
    app.post('/coffee', async(req,res)=>{
      const newCoffee= req.body
      console.log(newCoffee)
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    // put 
    app.put('/coffee/:id',async(req,res)=>{
      const updatedCoffee = req.body 
      const id = req.params.id 
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const coffee = {
        $set:{
          name:updatedCoffee.name,
          chef:updatedCoffee.chef,
          category:updatedCoffee.category,
          quantity:updatedCoffee.quantity,
          teste:updatedCoffee.teste,
          details:updatedCoffee.details,
          photo:updatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter,coffee,options)
      res.send(result)
    })

    // delete 
    app.delete('/coffee/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
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

const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 5000;

//middlewere 
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gtyxm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('genious-car-service').collection('service')
        const orderCollection = client.db('genious-car-service').collection('order')

        //(crud) service API table / collection / schema
        //all data load from database
       app.get('/service',async(req,res)=>{
        const query ={};
        const cursor = serviceCollection.find(query)
        const services = await cursor.toArray();
        res.send(services)
       })
       //single data loade based on param
       app.get('/service/:id',async(req,res)=>{
           const id = req.params.id;
           const query= {_id: ObjectId(id)}
           const service = await serviceCollection.findOne(query);
           res.send(service)
       })
       // post 
       app.post('/service',async(req,res)=>{
           const newService = req.body;
           const result = await serviceCollection.insertOne(newService);
           res.send(result)
       })
        // delete 
        app.delete('/service/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await serviceCollection.deleteOne(query);
            res.send(result)
        })
          //(crud) order api table / collection / schema
        app.post('/order', async(req,res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })
    }
    finally{

    }
}run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('home')
})
app.listen(PORT,()=>{
    console.log(`server running ${PORT}`)
})

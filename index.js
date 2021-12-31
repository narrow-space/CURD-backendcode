const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const port = process.env.PORT || 5000
//middele ware
app.use(cors())
app.use(express.json())



////userName:EmployeeList
///password:ml3Z7NMKEq0cvWuO



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6uzmb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db("EmployeeList");
        const userCollection = database.collection("user");
        // create a document to insert

        //   get all users
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({})
            const alluser = await cursor.toArray()
            res.send(alluser)
        })

        ///send user on server//
        app.post('/adduser',async (req, res) => {
            const newuser = req.body
            
            const result = await userCollection.insertOne(newuser)
            console.log(result);
            res.json(result)
    });

    /// Delete users//
    app.delete('/users/:id',async(req,res)=>{
        const id =req.params.id;
        const query ={_id:ObjectId(id)};
        const result = await userCollection.deleteOne(query)
        console.log(result);
        
        res.json(result)
    })

    ///update user///
    app.put('/users/:id',async(req,res)=>{
        const id =req.params.id;
        const query ={_id:ObjectId(id)};
        const result = await userCollection.updateOne(query)
        console.log(result);
        
        res.json(result)
    })

    //get a single user//
    app.get('/users/:id',async(req,res)=>{
        const id =req.params.id;
        const query ={_id:ObjectId(id)};
        const user = await userCollection.findOne(query)
        console.log(id);
        res.send(user)
    })

    ///update a user///

    app.put('/addusers/:id',async(req,res)=>{
        const id =req.params.id;
        const updatedUser=req.body
        console.log(updatedUser);
        const filter ={_id:ObjectId(id)};
        const options ={upsert:true};
        const updateDoc={
            $set:{
                name:updatedUser.name,
                phone:updatedUser.phone,
                website:updatedUser.website,
                email:updatedUser.email,
                company:updatedUser.company,
                address:updatedUser.address,


            }
        }
        const result = await userCollection.updateOne(filter,updateDoc,options)
        
        
        
        res.json(result)
    })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server running')
});

app.listen(port, () => {
    console.log("Running server on port", port);
})
const express = require("express");
const {MongoClient} = require('mongodb');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/all", async (req, res) => {
    const uri = "mongodb+srv://root:root@bp-fsd1.2cr9o.mongodb.net/bp";
    const client = new MongoClient(uri);
    await client.connect();

    const database = client.db('bp');
    database.collection('bp').find({}).toArray(function(err, result) {
        if (err) throw err;
        // console.log(result);
        client.close();
        res.json({ message: result });
    })
});

app.post("/one", async (req, res) => {
    const uri = "mongodb+srv://root:root@bp-fsd1.2cr9o.mongodb.net/bp";
    const client = new MongoClient(uri);
    await client.connect();
    
    var ObjectID = require('mongodb').ObjectId;
    
    const database = client.db("bp");
    const query = { "_id": ObjectID(req.body.id) };
    database.collection("bp").remove(query, function(err, result) {
        if (err) throw err;
        // console.log(result);
        client.close();
        res.json({ message: result });
    })
});

app.post("/save", async (req, res) => {
    const uri = "mongodb+srv://root:root@bp-fsd1.2cr9o.mongodb.net/bp";
    const client = new MongoClient(uri);
    await client.connect();

    var ObjectID = require('mongodb').ObjectId;

    const database = client.db("bp");
    if (req.body.id) {
        const query = { "_id": ObjectID(req.body.id) };
        const vals = { $set: { name: req.body.name, email: req.body.email,
                               phone: req.body.phone, address: req.body.address } };
        database.collection("bp").updateOne(query, vals, function(err, result) {
            if (err) throw err;
            // console.log(result);
            client.close();
            res.json({ message: result });
        })
    }else{
        const vals = { name: req.body.name, email: req.body.email,
                       phone: req.body.phone, address: req.body.address };
        database.collection("bp").insertOne(vals, function(err, result) {
            if (err) throw err;
            // console.log(result);
            client.close();
            res.json({ message: result });
        })
    }
});

app.post("/delete", async (req, res) => {
    const uri = "mongodb+srv://root:root@bp-fsd1.2cr9o.mongodb.net/bp";
    const client = new MongoClient(uri);
    await client.connect();

    var ObjectID = require('mongodb').ObjectId;

    const database = client.db("bp");
    const query = { "_id": ObjectID(req.body.id) };
    database.collection("bp").remove(query, function(err, result) {
        if (err) throw err;
        // console.log(result);
        client.close();
        res.json({ message: result });
    })
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const app = express();
app.use(cors());
app.use(bodyParser.json());

// dbUser & pass ata always hide . 
const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });

const users = ['arif', 'jamil', 'Kamal', 'Jamal', 'Rohim', 'Karim'];


// database connection

// mongodb+srv://dbUserFoyjul:<password>@cluster0-fesfb.mongodb.net/test?retryWrites=true&w=majority


app.get('/products', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({name:'Mobile'}).limit(10).toArray((err, documents) => {
             if (err) {
                 console.log(err)
                 res.status(500).send({message:err});   
             } else {
                res.send(documents);
             }
        });
      //console.log('Database Connected...')
        client.close();
    });
})

// app.get('/fruits/banana', (req, res) =>{
//     res.send({fruit:'banana', quantity:1000, price:10000});

// })
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    //console.log(req.query.sort);
    const name = users[id];
    res.send({id, name});
})

//post

app.post('/addProduct', (req, res) => {
    
//save to database
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insertOne(product, (err, result) => {
             if (err) {
                 console.log(err)
                 res.status(500).send({message:err});   
             } else {
                res.send(result.ops[0]);
             }
        });
      //console.log('Database Connected...')
        client.close();
      });

})
const post = process.env.PORT || 4200;
app.listen(post, () => console.log('Listening to port 4200'));


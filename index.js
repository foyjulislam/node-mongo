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
        collection.find().toArray((err, documents) => {
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

// single get product
app.get('/product/:key', (req, res) => {
    const key = req.params.key;
    //console.log(req.query.sort);
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key: key}).toArray((err, documents) => {
             if (err) {
                 console.log(err)
                 res.status(500).send({message:err});   
             } else {
                res.send(documents[0]);
             }
        });
      //console.log('Database Connected...')
        client.close();
    });
})

app.post('/getProductsByKey', (req, res) => {
    const key = req.params.key;
    const productKeys = req.body;
    console.log(productKeys);
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key: { $in: productKeys}}).toArray((err, documents) => {
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


//post

app.post('/addProduct', (req, res) => {
    
//save to database
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insert(product, (err, result) => {
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

app.post('/placeOrder', (req, res) => {
  const orderDetails = req.body;
    orderDetails.orderTime  = new Date();
    console.log(orderDetails);

        client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("onlineStore").collection("orders");
            collection.insertOne(orderDetails , (err, result) => {
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


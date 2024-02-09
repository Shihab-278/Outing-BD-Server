const express = require('express');
const bodyparser = require("body-parser")
const cors = require('cors');
const SSLCommerzPayment = require('sslcommerz-lts')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());





//mongo connection start///

user = process.env.DB_USER
pass = process.env.DB_PASS

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${user}:${pass}@cluster0.imav3gf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// sslcommerze

const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASS;
const is_live = false //true for live, false for sandbox

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const packageCollection = client.db('OutingBD').collection('packages')
    const reviewCollection = client.db('OutingBD').collection('reviewdata')

    const guidesCollection = client.db('OutingBD').collection('guides')
    const guidereviewCollection = client.db('OutingBD').collection('guidereviewdata')

    const bookingCollection = client.db('OutingBD').collection('bookingdata')
    const guidebookingCollection = client.db('OutingBD').collection('guidebookingdata')

    const packagePaymentCollection = client.db('OutingBD').collection('packagePayment')
    const guidePaymentCollection = client.db('OutingBD').collection('guidePayment')

    // get packages data

    app.get('/packages', async (req, res) => {
      const cursor = packageCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    //get packages data by id


    app.get('/packages/:id', async (req, res) => {
      const packId = req.params.id;

      const result = await packageCollection.findOne({ _id: new ObjectId(packId) });
      res.send(result)
    });


    // get guide data

    app.get('/guides', async (req, res) => {
      const cursor = guidesCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    //get guide data by id


    app.get('/guides/:id', async (req, res) => {
      const packId = req.params.id;

      const result = await guidesCollection.findOne({ _id: new ObjectId(packId) });
      res.send(result)
    });







    // booking data add to server side

    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking)
      res.send(result);
    })

    //get specific data 

    app.get('/bookings', async (req, res) => {
      console.log(req.query);

      let query = {};

      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    })



   


    //delete booking

    // delete specific data

    app.delete('/bookings/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const result = await bookingCollection.deleteOne(query)
      res.send(result)
    })

    //get specific booking data by id
    app.get('/bookings/:id', async (req, res) => {
      const bookingId = req.params.id;
      try {
        const bookById = await bookingCollection.findOne({ _id: new ObjectId(bookingId) });
        if (!bookById) {
          // If room is not found, return a 404 status
          return res.status(404).json({ error: 'revie not found' });
        }
        res.json(bookById);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    })



    // ::::: guide book:::::

    // booking data add to server side

    app.post('/guidebookings', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await guidebookingCollection.insertOne(booking)
      res.send(result);
    })

    //get specific data 

    app.get('/guidebookings', async (req, res) => {
      console.log(req.query);

      let query = {};

      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await guidebookingCollection.find(query).toArray();
      res.send(result);
    })


    //delete booking

    // delete specific data

    app.delete('/guidebookings/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const result = await guidebookingCollection.deleteOne(query)
      res.send(result)
    })

    //get specific booking data by id
    app.get('/guidebookings/:id', async (req, res) => {
      const bookingId = req.params.id;
      try {
        const bookById = await guidebookingCollection.findOne({ _id: new ObjectId(bookingId) });
        if (!bookById) {
          // If room is not found, return a 404 status
          return res.status(404).json({ error: 'revie not found' });
        }
        res.json(bookById);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    })

    // ::::guide book end

    // insert review data 


    // booking data add to server side

    app.post('/reviews', async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await reviewCollection.insertOne(review)
      res.send(result);


    })
    // booking data get from server side

    app.get('/reviews', async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //get rooms data by id from   mdb
    app.get('/reviews/:id', async (req, res) => {
      const reviewid = req.params.id;
      try {
        const review = await reviewCollection.findOne({ _id: new ObjectId(reviewid) });
        if (!review) {
          // If room is not found, return a 404 status
          return res.status(404).json({ error: 'revie not found' });
        }
        res.json(review);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });




    // ::::guide revieww::::

    app.post('/guidereviews', async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await guidereviewCollection.insertOne(review)
      res.send(result);


    })
    // booking data get from server side

    app.get('/guidereviews', async (req, res) => {
      const cursor = guidereviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //get rooms data by id from   mdb
    app.get('/guidereviews/:id', async (req, res) => {
      const reviewid = req.params.id;
      try {
        const review = await guidereviewCollection.findOne({ _id: new ObjectId(reviewid) });
        if (!review) {
          // If room is not found, return a 404 status
          return res.status(404).json({ error: 'revie not found' });
        }
        res.json(review);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });


    // ::::guide revieww endd::::

    // Dashboard Functionality

    // DELETE packages
    app.delete('/packages/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await packageCollection.deleteOne(query);
      res.send(result);
    })
    // CREATE packages
    app.post('/packages', async (req, res) => {
      const newPackage = req.body;
      const result = await packageCollection.insertOne(newPackage);
      res.send(result);
    })
    // DELETE guides
    app.delete('/guides/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await guidesCollection.deleteOne(query);
      res.send(result);
    })
    // CREATE guides
    app.post('/guides', async (req, res) => {
      const newGuide = req.body;
      console.log(newGuide);
      const result = await guidesCollection.insertOne(newGuide);
      res.send(result);
    })

    // payment details

    app.get('/payment', async (req, res) => {
      const cursor = packagePaymentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    // :::dahsboard End::::


    // :::PAYMENT::::for package

    const tran_id = new ObjectId().toString();
    console.log("tran id",tran_id);

    app.post("/order", async (req, res) => {


      const order = req.body;
      const package = await bookingCollection.findOne({ _id: new ObjectId(req.body._id) });
      

      console.log(package.price);

      const data = {
        total_amount: package.price,
        currency: 'BDT',
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `http://localhost:5000/payment/success/${tran_id}`,
        fail_url: `http://localhost:5000/payment/fail/${tran_id}`,
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: order.name,
        product_category: 'a',
        product_profile: 'general',
        cus_name: order.uname,
        cus_email: order.email,
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
      };
      console.log(data);
      console.log(store_id, store_passwd);



      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)

      sslcz.init(data).then((apiResponse) => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.send({ url: GatewayPageURL });

        const finalOrder = {
          package,
          paidStatus: false,
          tramsactionId: tran_id
        }
        const result = packagePaymentCollection.insertOne(finalOrder);
        console.log('Redirecting to: ', GatewayPageURL)


      });

      app.post("/payment/success/:tranId", async (req, res) => {
        console.log(req.params.tranId);
        const result = await packagePaymentCollection.updateOne({ tramsactionId: req.params.tranId }, {
          $set: {
            paidStatus: true,
          },
        });

        if (result.modifiedCount > 0) {
          res.redirect(`http://localhost:5173/payment/success/${req.params.tranId}`)
        }

      });

      app.post("/payment/fail/:tranId", async (req, res) => {
        const result = await packagePaymentCollection.deleteOne({ tramsactionId: req.params.tranId })

        if (result.deletedCount) {
          res.redirect(`http://localhost:5173/payment/fail/${req.params.tranId}`)
        }
      })



    })


    //payment for guide 
    const guidetran_id = new ObjectId().toString();
    console.log("tran id",guidetran_id);

    app.post("/guideorder", async (req, res) => {


      const gorder = req.body;
      const guide = await guidebookingCollection.findOne({ _id: new ObjectId(req.body._id) });
      

      console.log(guide.gprice);

      const data = {
        total_amount: guide.price,
        currency: 'BDT',
        tran_id: guidetran_id, // use unique tran_id for each api call
        success_url: `http://localhost:5000/payment/success/${guidetran_id}`,
        fail_url: `http://localhost:5000/payment/fail/${guidetran_id}`,
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: gorder.name,
        product_category: 'a',
        product_profile: 'general',
        cus_name: gorder.uname,
        cus_email: gorder.email,
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
      };
      console.log(data);
      console.log(store_id, store_passwd);



      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)

      sslcz.init(data).then((apiResponse) => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.send({ url: GatewayPageURL });

        const finalOrder = {
          guide,
          paidStatus: false,
          tramsactionId: guidetran_id
        }
        const result = guidePaymentCollection.insertOne(finalOrder);
        console.log('Redirecting to: ', GatewayPageURL)


      });

      app.post("/payment/success/:tranId", async (req, res) => {
        console.log(req.params.tranId);
        const result = await guidePaymentCollection.updateOne({ tramsactionId: req.params.tranId }, {
          $set: {
            paidStatus: true,
          },
        });

        if (result.modifiedCount > 0) {
          res.redirect(`http://localhost:5173/payment/success/${req.params.tranId}`)
        }

      });

      app.post("/payment/fail/:tranId", async (req, res) => {
        const result = await guidePaymentCollection.deleteOne({ tramsactionId: req.params.tranId })

        if (result.deletedCount) {
          res.redirect(`http://localhost:5173/payment/fail/${req.params.tranId}`)
        }
      })



    })






    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//mongo connection end///



app.get('/', (req, res) => {
  res.send('running')
})

app.listen(port, () => {
  console.log(`running port : ${port}`);
})

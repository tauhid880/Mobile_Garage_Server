const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middelware
app.use(cors());
app.use(express.json());

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ezb7aqf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// MongoDB operation
async function run() {
  try {
    // categories collection
    const categoriesOptionsCollection = client
      .db("mobileGarage")
      .collection("categories");

    // categories products collection
    const categoriesProductsCollection = client
      .db("mobileGarage")
      .collection("products");
    // User Collection
    const usersCollection = client.db("mobileGarage").collection("users");

    // Get Categories Data
    app.get("/categories", async (req, res) => {
      const query = {};
      const categories = await categoriesOptionsCollection
        .find(query)
        .toArray();
      res.send(categories);
    });

    // app.get("/products/:id", async (req, res) => {
    //   const category = req.params.category;
    //   const query = { Categories_Name: category };
    //   const products = categoriesProductsCollection.find(query).toArray();
    //   res.send(products);
    // });

    // // Get categories products
    app.get("/products/:Category_id", async (req, res) => {
      const CategoryId = req.params.Category_id;
      const query = { Category_id: CategoryId };
      const products = await categoriesProductsCollection.find(query).toArray();
      res.send(products);
    });

    // All Products
    // app.get("/products", async (req, res) => {
    //   const query = {};
    //   const products = await categoriesProductsCollection.find(query).toArray();
    //   res.send(products);
    // });

    // // Store Users data in data base
    // app.post("/users", async (req, res) => {
    //   const user = req.body;
    //   const result = await usersCollection.insertOne(user);
    //   res.send(result);
    // });

    // Save user email & generate JWT
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);

      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
      });
      console.log(token);
      res.send({ result, token });
    });
  } finally {
  }
}

run().catch(console.dir);

// Test Route
app.get("/", async (req, res) => {
  res.send("Mobile Garage server is running");
});

// Listen the port
app.listen(port, () => console.log(`Mobile Garage running on ${port}`));

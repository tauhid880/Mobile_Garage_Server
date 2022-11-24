const express = require("express");
const cors = require("cors");
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
    const categoriesOptionsCollection = client
      .db("mobileGarage")
      .collection("categories");
    // Get Categories Data
    app.get("/categories", async (req, res) => {
      const query = {};
      const categories = await categoriesOptionsCollection
        .find(query)
        .toArray();
      res.send(categories);
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

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('colors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

//* Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Portfolio server is running');
});

//* Mongodb Atlas
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yeflywl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const dbConnect = async () => {
  try {
    await client.connect();
    console.log('Database connected'.yellow.italic);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
};

dbConnect();

//* Collections
const projectsCollection = client.db('PortfolioUser').collection('projects');

//* -------------------------GET(READ)-------------------------
// get all projects
app.get('/projects', async (req, res) => {
  try {
    const query = {};
    const projects = await projectsCollection.find(query).toArray();
    res.send(projects);
  } catch (error) {
    console.log(error.message.bold);
  }
});

// get specific project
app.get('/projects/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const project = await projectsCollection.findOne(query);
    res.send(project);
  } catch (error) {
    console.log(error.message.bold);
  }
});

app.listen(port, () => {
  console.log('Server up and running'.cyan.bold);
});

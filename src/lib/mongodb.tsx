// lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const options = {};

if (!uri) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

// Use a global variable to maintain a cache across hot reloads in development
declare global {
  // allow global to have this property
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In dev mode, use a global variable so that you don't create multiple connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In prod, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

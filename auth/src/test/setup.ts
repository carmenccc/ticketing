import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

let mongo: any;

// A hook function run before all test execution
beforeAll(async () => {
  // Startup MongoMemoryServer and have mongoose connect to it
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

// A hoot run before each test
beforeEach(async () => {
  // delete and reset all data before each test begin
  const collections = await mongoose.connection.db!.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// A hoot to clean up after all tests completed
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

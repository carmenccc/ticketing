import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

let mongo: any;

// A hook function run before all test execution
beforeAll(async () => {
  // Set environment variables
  process.env.JWT_KEY = "asjskdla";

  // Startup MongoMemoryServer and have mongoose connect to it
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = mongo.getUri();

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

// Global helper functions
global.signin = () => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(), // generate a valid mongoose id (random)
    email: "test@test.com",
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MOCK_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64 (cookie format)
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string that's the cookie with the encoded data
  return [`session=${base64}`];
};

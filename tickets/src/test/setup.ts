import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  var signin: () => Promise<string[]>;
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
global.signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie")!;

  return cookie;
};

import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

const generateValidMongooseId = () =>
  new mongoose.Types.ObjectId().toHexString();

it("returns a 404 if the ticket is not found", async () => {
  const id = generateValidMongooseId();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "concert";
  const price = 200;

  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const findResponse = await request(app)
    .get(`/api/tickets/${createResponse.body.id}`)
    .send()
    .expect(200);

  expect(findResponse.body.title).toEqual(title);
  expect(findResponse.body.price).toEqual(price);
});

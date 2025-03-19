import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

const generateValidMongooseId = () =>
  new mongoose.Types.ObjectId().toHexString();

it("returns a 404 if the provided id does not exist", async () => {
  const id = generateValidMongooseId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "ajlskd",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = generateValidMongooseId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "ajlskd",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "jalskd",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "new",
      price: 1000,
    })
    .expect(401);
});

it("returns a 400 if the user provided an invalid title or price", async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "jalskd",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 1000,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new",
      price: -100,
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();

  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "jalskd",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "newtitle",
      price: 1000,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${createResponse.body.id}`)
    .set("Cookie", cookie)
    .send();

  expect(ticketResponse.body.title).toEqual("newtitle");
  expect(ticketResponse.body.price).toEqual(1000);
});

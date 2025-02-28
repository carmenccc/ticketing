import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  // Sign up and get the cookie
  const cookie = await global.signin();

  // Manually add the cookie to the request
  // as testing environment does not a session added by browser
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});

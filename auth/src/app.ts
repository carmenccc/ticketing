import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@cmctickets/common";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();
app.set("trust proxy", true); // trust proxy of ingress nginx
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable cookieSession encryption for compatibility among languages
    secure: process.env.NODE_ENV !== "test", // only allow https request (except for test environment)
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Assume there is an async error, throw does not handle it properly
// use next or install the express-async-errors (refer to the express doc)
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };

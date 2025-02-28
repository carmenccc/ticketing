import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  // 1. Check if there is a jwt in cookie
  if (!req.session?.jwt) {
    res.send({ currentUser: null });
    return;
  }

  // 2. Verify if jwt is valid
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch (err) {
    // if the jwt has been tempered, verify() will throw an error
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };

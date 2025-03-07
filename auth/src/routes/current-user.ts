import express from "express";
import { getCurrentUser } from "@cmctickets/common";

const router = express.Router();

router.get("/api/users/currentuser", getCurrentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

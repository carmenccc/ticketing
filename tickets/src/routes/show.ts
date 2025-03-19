import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@cmctickets/common";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  // Find the ticket on id
  const ticket = await Ticket.findById(req.params.id);

  // Not found error
  if (!ticket) {
    throw new NotFoundError();
  }

  // Response with found ticket
  res.send(ticket);
});

export { router as showTicketRouter };

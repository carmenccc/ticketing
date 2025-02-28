import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

// Augmenting type definition:
// reach into an existing type and make modification
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Check if there is a jwt in cookie
  if (!req.session?.jwt) {
    return next();
  }

  // 2. Verify if jwt is valid & extract payload
  try {
    // if the jwt has been tempered, verify() will throw an error
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}
  next();
};

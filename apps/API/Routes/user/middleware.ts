import type { Response, Request, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_TOKEN;

export const Authorize = (req: Request, res: Response, next: NextFunction) => {
  const token = req.session.sessionpayload?.token;
  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  // Verify token
  jwt.verify(token, SECRET_KEY as string, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token is invalid or expired" });
    }

    // Attach user info to request
    req.userid= user as JwtPayload;
    next();
  });
};

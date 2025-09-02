import type { Response, Request, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_TOKEN;

export const Authorize = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log(SECRET_KEY);

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];

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

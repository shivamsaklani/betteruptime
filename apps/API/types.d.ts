import { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      userid?:JwtPayload;
    }
  }
}

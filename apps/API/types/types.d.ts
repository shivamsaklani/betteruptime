import { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
import "express-session";
declare global {
  namespace Express {
    interface Request {
      userid?:JwtPayload;
    }
  }
}
declare module "express-session" {
  interface SessionData {
    sessionpayload?: {
      token: string;
      refreshToken: string;
      id: string;
      Username: string;
    };
  }
}

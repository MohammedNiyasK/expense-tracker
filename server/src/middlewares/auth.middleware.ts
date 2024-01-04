import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface Token {
  _id: string;
  email: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user: Token;
    }
  }
}

const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accesToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError({ message: "Unauthorized request", status: 401 });
    }

    const decodedToken = verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as Token;

    req.user = decodedToken;

    next();
  }
);

export { verifyJWT };

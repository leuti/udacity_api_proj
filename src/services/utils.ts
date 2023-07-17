import express, { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

// For debugging: load debugLevel from ENV --> if TRUE console.log statements are generated
import dotenv from 'dotenv';
dotenv.config();

// Middleware to ensura that the requestor is authorized to use this route.
// The provided token will be validated before allowing access to the protected resource
const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorisationHeader = req.headers.authorization;
    const token = authorisationHeader?.split(' ')[1];

    if (!token) {
      throw new Error('Token not found');
    }

    const secret = process.env.TOKEN_SECRET as Secret;
    if (!secret) {
      throw new Error('Token secret not found');
    }

    jwt.verify(token, secret); // ignore error

    next();
  } catch (err) {
    res.status(401);
    res.json(`Invalid token ${err}`);
    return;
  }
};

const debugLevel: number = parseInt(process.env.DEBUG_LEVEL || '0');

export default { verifyAuthToken, debugLevel };

import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorisationHeader = req.headers.authorization;
    const token = authorisationHeader?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET ?? '') as string; // ignore error

    next();
  } catch (err) {
    res.status(401);
    res.json(`Invalid token ${err}`);
    return;
  }
};

// Create an instance of the Express application
const app = express();

// Setup routes and middleware
app.use(verifyAuthToken);

// Export the app instance instead of // export default verifyAuthToken;
export default app;

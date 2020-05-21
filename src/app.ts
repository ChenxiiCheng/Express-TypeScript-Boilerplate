import path from 'path';
import 'dotenv/config';
import 'colors';
import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileupload from 'express-fileupload';
import connectDB from '@config/mongo';
import errorMiddleware from '@middlewares/error.middleware';
import authRoute from '@routes/auth.route';
import adminUserRoute from '@routes/adminuser.route';

class App {
  public express: Application;

  public constructor() {
    this.express = express();

    this.database();
    this.middlewares();
    this.routes();
    this.exceptions();
  }

  // Connect to DB
  private database(): void {
    connectDB();
  }

  // Middlewares
  private middlewares(): void {
    // Cors
    this.express.use(cors());

    // Request Logger
    if (process.env.NODE_ENV === 'development') {
      this.express.use(morgan('dev'));
    }

    // Body Parser
    this.express.use(express.json());

    // Cookie parser: store token in cookie to client side
    this.express.use(cookieParser());

    // Set static folder
    this.express.use(express.static(path.join(__dirname, 'public')));

    // File Upload
    this.express.use(fileupload());
  }

  // Routes
  private routes(): void {
    this.express.use('/api/v1/auth', authRoute);
    this.express.use('/api/v1/users', adminUserRoute);
  }

  // Global error handler
  private exceptions(): void {
    this.express.use(errorMiddleware);
  }
}

export default new App().express;

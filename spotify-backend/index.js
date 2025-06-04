// server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './src/config/mongodb.js';
import connectCloudinary from './src/config/cloudinary.js';
import userRouter from './src/routes/userRoute.js';
import songRouter from './src/routes/songRoute.js';
import albumRouter from './src/routes/albumRoute.js';
import adminRouter from './src/routes/adminRoutes.js';
import searchRouter from './src/routes/searchRoutes.js'
import playlistRouter from './src/routes/playlistRoutes.js'

import { limiter, detectBot, applySecurityHeaders } from './src/middleware/security.js';
import useragent from 'express-useragent';
import compression from 'compression';
import helmet from 'helmet';

const createServer = async () => {
  const app = express();

  await connectCloudinary();
  await connectDB();

  app.use(useragent.express());
  app.use(applySecurityHeaders);
  app.use(limiter);
  app.use(detectBot);
  app.use(express.json());
  app.use(cors({
    origin : "https://spotify-monorepo-frontend.onrender.com",
    credentials : true,
  }));
  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());

  app.use('/api/user', userRouter);
  app.use('/api/song', songRouter);
  app.use('/api/album', albumRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/search', searchRouter)
  app.use('/api/playlist', playlistRouter);

  app.get("/", (req, res) => res.send("API Working"));

  return app;
};

export default createServer;

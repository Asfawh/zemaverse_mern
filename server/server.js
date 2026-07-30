import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from './config/mongoose.config.js';
import songRoute from './routes/song.routes.js';
import userRoute from "./routes/user-routes.js";
import reactionRoute from './routes/reaction.routes.js';
import serverless from 'serverless-http';

//pulling env vars
dotenv.config();

//making instance of our express service
const app = express();

//attach middleware to our express service
app.use(express.json(), cors());

app.get('/api/health', (_req, res) => res.status(200).json({ status: 'ok' }));

async function ensureDatabase(_req, _res, next) {
  try {
    await dbConnect();
    next();
  } catch (err) {
    next(err);
  }
}

app.use('/api/songs', ensureDatabase, songRoute);
app.use('/api/users', ensureDatabase, userRoute);
app.use('/api/reactions', ensureDatabase, reactionRoute);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(503).json({ message: 'Service temporarily unavailable' });
});

export const handler = serverless(app);

if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const PORT = process.env.PORT || 8004;
  app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}

# ZemaVerse MERN

EOTC ZemaVerse song library built with React, Express, and MongoDB Atlas.

## Local development

1. Install all workspace dependencies:

   ```bash
   npm run install:all
   ```

2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` and
   `JWT_SECRET`. Never commit this file.

3. Start the API and Vite client together:

   ```bash
   npm run dev
   ```

The client runs at `http://localhost:5173`; Vite proxies `/api` requests to the
Express API at `http://localhost:8004`.

## Production deployment

Pushing to `main` automatically runs the production deployment workflow. It
uses GitHub OIDC for short-lived AWS credentials, deploys the Lambda API and
Vite client, refreshes CloudFront, and verifies `zemaverse.com`.

The AWS role trusts only the `main` branch of `Asfawh/zemaverse_mern`; no
long-lived AWS access keys are stored in GitHub.

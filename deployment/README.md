# ZemaVerse AWS deployment

This deployment uses S3 + CloudFront for the Vite client and API Gateway +
Lambda for the Express API. MongoDB remains in Atlas. The AWS provider uses the
`habtamua` profile and `us-west-2`; the CloudFront certificate is created in
`us-east-1` as required by AWS.

Secrets are deliberately not represented as Terraform variables because values
passed through Terraform would be retained in state. Configure `MONGODB_URI` and
`JWT_SECRET` directly on the Lambda after the first apply.

The `.com` redirect should be added only after `zemaverse.com` is registered and
delegated. As of 2026-07-21 the registry reports that the domain is not registered.

## Automatic production deployment

`.github/workflows/deploy-production.yml` deploys every push to `main` and can
also be run manually from the GitHub Actions page. It builds the Vite client,
packages and updates the Lambda API, syncs the client to S3, waits for the
CloudFront invalidation, and verifies the public site and health endpoint.

The workflow uses GitHub OIDC to assume the
`zemaverse-github-actions-deploy` role. The trust policy accepts tokens only from
`Asfawh/zemaverse_mern` on `refs/heads/main` (bound to the immutable GitHub
owner and repository IDs), and its deployment policy is limited
to the production site bucket, Lambda function, and CloudFront distribution.
No AWS access keys or application secrets are stored in GitHub.

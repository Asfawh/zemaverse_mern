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

## CloudFront Free plan

The production distribution uses AWS managed cache and origin-request policies
and `PriceClass_All` so it is compatible with the CloudFront flat-rate Free
plan. Its dedicated CloudFront Function adds non-disruptive browser security
headers without a
custom response-header policy, preserving Google AdSense behavior. The
dedicated CloudFront-scope WAF applies a Free-plan-compatible global per-IP
limit of 1,000 requests per five minutes. API Gateway separately limits the API
to 10 requests per second with a burst of 20.

The pricing-plan subscription itself is managed through AWS
PricingPlanManager, which is not represented by the pinned Terraform AWS
provider. The subscription must contain exactly this distribution and its
dedicated WAF web ACL. Do not share the function or WAF ACL with another
distribution because flat-rate plan resources must be exclusive to one plan.
The active Free subscription also contains the `zemaverse.com` Route 53 hosted
zone so its standard hosted-zone, record, and DNS-query charges are covered by
the plan. Terraform manages the compatible distribution, function, WAF, and
throttling configuration; do not cancel or detach the PricingPlanManager
subscription when applying future infrastructure changes.

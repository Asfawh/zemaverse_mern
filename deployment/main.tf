terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws     = { source = "hashicorp/aws", version = "~> 5.0" }
    archive = { source = "hashicorp/archive", version = "~> 2.4" }
  }
}

provider "aws" {
  region  = "us-west-2"
  profile = "habtamua"
}

provider "aws" {
  alias   = "us_east_1"
  region  = "us-east-1"
  profile = "habtamua"
}

locals {
  domain_name               = "zemaverse.com"
  origin_id                 = "zemaverse-static-origin"
  caching_optimized_policy  = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  caching_disabled_policy   = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
  api_origin_request_policy = "b689b0a8-53d0-40ab-baf2-68738e2966ac"
}

data "aws_route53_zone" "primary" {
  name         = local.domain_name
  private_zone = false
}

data "aws_caller_identity" "current" {}

data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

data "aws_iam_policy_document" "github_actions_assume_role" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [data.aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:Asfawh@44281799/zemaverse_mern@1317695764:ref:refs/heads/main"]
    }
  }
}

resource "aws_iam_role" "github_actions_deploy" {
  name                 = "zemaverse-github-actions-deploy"
  description          = "Deploy ZemaVerse production from the main branch in GitHub Actions"
  assume_role_policy   = data.aws_iam_policy_document.github_actions_assume_role.json
  max_session_duration = 3600
}

resource "aws_s3_bucket" "site" {
  bucket_prefix = "zemaverse-site-"
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "zemaverse-site-oac"
  description                       = "Private access to the ZemaVerse site bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_acm_certificate" "site" {
  provider                  = aws.us_east_1
  domain_name               = local.domain_name
  subject_alternative_names = ["www.${local.domain_name}"]
  validation_method         = "DNS"
  lifecycle { create_before_destroy = true }
}

resource "aws_route53_record" "certificate_validation" {
  for_each = {
    for option in aws_acm_certificate.site.domain_validation_options : option.domain_name => {
      name   = option.resource_record_name
      record = option.resource_record_value
      type   = option.resource_record_type
    }
  }
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "site" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.site.arn
  validation_record_fqdns = [for record in aws_route53_record.certificate_validation : record.fqdn]
}

data "archive_file" "api" {
  type        = "zip"
  source_dir  = "${path.module}/../server"
  output_path = "${path.module}/zemaverse-api.zip"
  excludes    = [".env", ".env.example", "readme.md"]
}

resource "aws_iam_role" "lambda" {
  name = "zemaverse-api-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "api" {
  function_name    = "zemaverse-api"
  role             = aws_iam_role.lambda.arn
  runtime          = "nodejs22.x"
  architectures    = ["arm64"]
  handler          = "server.handler"
  filename         = data.archive_file.api.output_path
  source_code_hash = data.archive_file.api.output_base64sha256
  memory_size      = 512
  timeout          = 20

  environment {
    variables = {
      MONGODB_URI = "configured-after-terraform-apply"
      JWT_SECRET  = "configured-after-terraform-apply"
    }
  }

  lifecycle {
    # Runtime secrets are configured directly in Lambda so they never enter
    # Terraform state or Git. Application code is deployed by GitHub Actions,
    # not by infrastructure-only Terraform applies.
    ignore_changes = [environment, filename, source_code_hash]
  }
}

resource "aws_apigatewayv2_api" "api" {
  name          = "zemaverse-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.api.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 20
    throttling_rate_limit  = 10
  }
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowApiGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*"
}

resource "aws_cloudfront_function" "security_headers" {
  name    = "zemaverse-security-headers"
  comment = "ZemaVerse browser security headers for the CloudFront Free plan"
  runtime = "cloudfront-js-2.0"
  publish = true
  code    = file("${path.module}/security-headers.js")
}

resource "aws_wafv2_web_acl" "site" {
  provider = aws.us_east_1
  name     = "zemaverse-cloudfront-free-plan"
  scope    = "CLOUDFRONT"

  default_action {
    allow {}
  }

  rule {
    name     = "site-ip-rate-limit"
    priority = 0
    action {
      block {}
    }
    statement {
      rate_based_statement {
        aggregate_key_type = "IP"
        limit              = 1000
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "ZemaVerseSiteIpRateLimit"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "ZemaVerseCloudFrontWebAcl"
    sampled_requests_enabled   = true
  }

  tags = {
    application  = "zemaverse"
    environment  = "production"
    pricing-plan = "cloudfront-free"
  }
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = [local.domain_name, "www.${local.domain_name}"]
  price_class         = "PriceClass_All"
  web_acl_id          = aws_wafv2_web_acl.site.arn

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = local.origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  origin {
    domain_name = replace(aws_apigatewayv2_api.api.api_endpoint, "https://", "")
    origin_id   = "zemaverse-api-origin"
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = local.origin_id
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = local.caching_optimized_policy

    function_association {
      event_type   = "viewer-response"
      function_arn = aws_cloudfront_function.security_headers.arn
    }
  }

  ordered_cache_behavior {
    path_pattern             = "/api/*"
    target_origin_id         = "zemaverse-api-origin"
    viewer_protocol_policy   = "https-only"
    allowed_methods          = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods           = ["GET", "HEAD"]
    cache_policy_id          = local.caching_disabled_policy
    origin_request_policy_id = local.api_origin_request_policy

    function_association {
      event_type   = "viewer-response"
      function_arn = aws_cloudfront_function.security_headers.arn
    }
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.site.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

data "aws_iam_policy_document" "site" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site.arn}/*"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.site.json
}

data "aws_iam_policy_document" "github_actions_deploy" {
  statement {
    sid = "ListProductionSite"
    actions = [
      "s3:GetBucketLocation",
      "s3:ListBucket",
    ]
    resources = [aws_s3_bucket.site.arn]
  }

  statement {
    sid = "UpdateProductionSite"
    actions = [
      "s3:DeleteObject",
      "s3:GetObject",
      "s3:GetObjectAttributes",
      "s3:PutObject",
    ]
    resources = ["${aws_s3_bucket.site.arn}/*"]
  }

  statement {
    sid = "UpdateProductionApi"
    actions = [
      "lambda:GetFunction",
      "lambda:GetFunctionConfiguration",
      "lambda:UpdateFunctionCode",
    ]
    resources = [aws_lambda_function.api.arn]
  }

  statement {
    sid = "RefreshProductionCdn"
    actions = [
      "cloudfront:CreateInvalidation",
      "cloudfront:GetInvalidation",
    ]
    resources = [
      "arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/${aws_cloudfront_distribution.site.id}",
    ]
  }
}

resource "aws_iam_role_policy" "github_actions_deploy" {
  name   = "zemaverse-production-deploy"
  role   = aws_iam_role.github_actions_deploy.id
  policy = data.aws_iam_policy_document.github_actions_deploy.json
}

resource "aws_route53_record" "apex_a" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = local.domain_name
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "apex_aaaa" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = local.domain_name
  type    = "AAAA"
  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www_a" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = "www.${local.domain_name}"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

output "site_bucket" { value = aws_s3_bucket.site.id }
output "cloudfront_distribution_id" { value = aws_cloudfront_distribution.site.id }
output "cloudfront_domain" { value = aws_cloudfront_distribution.site.domain_name }
output "api_endpoint" { value = aws_apigatewayv2_api.api.api_endpoint }
output "github_actions_role_arn" { value = aws_iam_role.github_actions_deploy.arn }
output "waf_web_acl_arn" { value = aws_wafv2_web_acl.site.arn }

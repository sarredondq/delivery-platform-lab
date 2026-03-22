# GitHub Actions Workflows

## Overview

GitHub Actions requires workflow files to live in `.github/workflows/` and composite actions in `.github/actions/`. This directory (`pipelines/github-actions/`) exists for documentation purposes, while the actual configuration lives where GitHub expects it.

**Actual config locations:**

- Workflows: `.github/workflows/`
- Composite actions: `.github/actions/`

## Workflows

| File | Name | Trigger | Purpose |
|------|------|---------|---------|
| `api-ci.yml` | API - Continuous Integration | PR to `main` (paths: `apps/api/**`) | Install, test, upload coverage |
| `web-ci.yml` | Web - Continuous Integration | PR to `main` (paths: `apps/web/**`) | Install, test, verify build, upload coverage |
| `api-cd.yml` | API - Continuous Delivery | Push to `main` (paths: `apps/api/**`) | Install prod deps, upload artifact |
| `web-cd.yml` | Web - Continuous Delivery | Push to `main` (paths: `apps/web/**`) | Build production bundle, upload artifact |
| `release.yml` | Release | Tag `v*` or manual (`workflow_dispatch`) | Validate artifacts, deploy to 3 clouds (parallel) |

## Composite Actions

Composite actions are the GitHub Actions equivalent of Azure DevOps step templates. They encapsulate reusable steps that multiple workflows can share.

| Action | Location | Purpose |
|--------|----------|---------|
| `setup-node-app` | `.github/actions/setup-node-app/` | Setup Node.js with npm cache and run `npm ci` |
| `run-tests` | `.github/actions/run-tests/` | Run `test:ci` and upload coverage artifact |

Usage in workflows:

```yaml
- uses: ./.github/actions/setup-node-app
  with:
    working-directory: apps/api
```

## Pipeline Flow

```
PR created          Push to main         Tag v*
     │                    │                 │
     ▼                    ▼                 ▼
 ┌───────┐          ┌──────────┐      ┌──────────┐
 │  CI   │          │    CD    │      │ Release  │
 │ test  │──merge──▶│  build   │      │ validate │
 └───────┘          │ artifact │      └────┬─────┘
                    └──────────┘           │
                                    ┌──────┼──────┐
                                    ▼      ▼      ▼
                                  ┌───┐  ┌───┐  ┌───┐
                                  │AWS│  │AZ │  │GCP│
                                  └───┘  └───┘  └───┘
                                   (parallel deploys)
```

## Branch Protection Rules

GitHub Actions integrates with Branch Protection Rules (the equivalent of Azure DevOps Branch Policies).

**Recommended settings for the `main` branch:**

1. **Require pull request reviews** — At least 1 approval before merge
2. **Require status checks to pass** — Select the CI workflow jobs (`test`) as required checks
3. **Require branches to be up to date** — Ensures PRs are tested against latest `main`
4. **Do not allow bypassing** — Even admins must follow the rules

Configure at: **Settings → Branches → Add branch protection rule**

## Runner Pricing

| Repository Type | Free Minutes | Notes |
|----------------|--------------|-------|
| Public | Unlimited | Free for open source |
| Private | 2,000 min/month (Free tier) | Linux runners; macOS and Windows cost more minutes |

Self-hosted runners are also supported for custom environments.

## Comparison with Azure DevOps

| Concept | Azure DevOps | GitHub Actions |
|---------|-------------|----------------|
| Pipeline config | `pipelines/**/*.yml` (any path) | `.github/workflows/*.yml` (fixed path) |
| Reusable steps | Step/job templates | Composite actions, reusable workflows |
| Triggers | `trigger:` / `pr:` | `on:` (push, pull_request, etc.) |
| Path filters | `paths.include` | `paths` |
| Artifacts | `PublishPipelineArtifact@1` | `actions/upload-artifact@v4` |
| Variables | Pipeline variables, variable groups | `env:`, secrets, variables |
| Environments | Environments with approvals | Environments with protection rules |
| Agent pools | `pool: vmImage: 'ubuntu-latest'` | `runs-on: ubuntu-latest` |

# Delivery Platform Lab

A hands-on laboratory for learning and mastering CI/CD pipelines, Infrastructure as Code, and multi-cloud deployments.

## Purpose

This is a **learning-first** project. The applications inside (`apps/`) are intentionally simple — they exist as deployment targets, not as production software. The real value lives in the pipelines, infrastructure definitions, and the workflows that connect them.

The goal: take the same code through different CI/CD tools and deploy it to multiple clouds using both Terraform and cloud-native IaC, learning the tradeoffs of each approach along the way.

## Project Structure

```
delivery-platform-lab/
├── apps/
│   ├── api/                    # Node.js Express API (deployment target)
│   └── web/                    # React + TypeScript frontend with Vite
├── infra/
│   ├── terraform/              # Terraform IaC (cloud-agnostic)
│   │   ├── aws/
│   │   ├── azure/
│   │   └── gcp/
│   └── native/                 # Cloud-native IaC
│       ├── aws/                # CloudFormation
│       ├── azure/              # ARM / Bicep
│       └── gcp/                # Deployment Manager
├── pipelines/
│   ├── azure-devops/           # Azure Pipelines configs and docs
│   ├── github-actions/         # GitHub Actions docs and helpers
│   ├── jenkins/                # Jenkinsfile and docs
│   └── circleci/               # CircleCI docs and helpers
├── docs/
│   ├── architecture.md         # Project architecture overview
│   ├── getting-started.md      # Setup and run instructions
│   └── tools/                  # One doc per CI/CD tool
│       └── README.md           # CI/CD tools overview and comparison
└── .gitignore
```

> **Note on pipeline config locations:** Some CI/CD tools require their configuration files in specific repository paths (e.g., GitHub Actions requires `.github/workflows/`, CircleCI requires `.circleci/config.yml`). In those cases, the `pipelines/{tool}/` directory contains documentation, helper scripts, and auxiliary configs, while the actual pipeline definition lives where the tool mandates. See [docs/tools/README.md](docs/tools/README.md) for details.

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Run the API

```bash
cd apps/api
npm install
npm start
# Server starts on http://localhost:3000
```

Endpoints:
- `GET /health` — Health check
- `GET /info` — API version and environment info

### Run the Frontend

```bash
cd apps/web
npm install
npm run dev
# Dev server starts on http://localhost:5173
```

### Run Tests

```bash
# API tests (Jest)
cd apps/api
npm test

# Frontend tests (Vitest)
cd apps/web
npm test
```

## Roadmap

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Base apps — API + Frontend with tests | Done |
| **Phase 2** | Azure DevOps pipelines | Next |
| **Phase 3** | Additional CI/CD tools (GitHub Actions, Jenkins, CircleCI) | Planned |
| **Phase 4** | Terraform multi-cloud IaC (AWS, Azure, GCP) | Planned |
| **Phase 5** | Native IaC per cloud (CloudFormation, ARM/Bicep, Deployment Manager) | Planned |
| **Phase 6** | Kubernetes and advanced topics (ArgoCD, Helm, multi-env) | Planned |

## Documentation

See the [`docs/`](docs/) directory for detailed documentation:

- [Architecture Overview](docs/architecture.md) — Project structure, layers, and design decisions
- [Getting Started](docs/getting-started.md) — Prerequisites, setup, and running locally
- [CI/CD Tools](docs/tools/README.md) — Overview and comparison of pipeline tools

## License

MIT

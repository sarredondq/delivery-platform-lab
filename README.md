# delivery-platform-lab

`delivery-platform-lab` is a monorepo for learning how CI/CD platforms can coexist around a shared delivery architecture. It provides a clean foundation for pipeline orchestration, reusable automation, environment contracts, and multi-cloud deployment planning across tools such as Azure DevOps, Jenkins, and GitHub Actions.

## Purpose

This repository is designed as a platform engineering lab rather than a collection of isolated pipelines. The goal is to centralize reusable delivery building blocks, operational conventions, and deployment structure so the repository can evolve into a more formal delivery platform over time.

## Goals

- Keep a single root for delivery automation, deployment structure, and shared tooling.
- Separate CI engine definitions from reusable modules and environment-specific assets.
- Support a multi-cloud operating model where shared logic lives in one place and provider-specific differences stay isolated.
- Allow Azure DevOps, GitHub Actions, and Jenkins to coexist without mixing responsibilities.
- Prepare the repository to grow from structural validation into fuller release and deployment workflows.

## Platform Documentation

- [Azure DevOps docs](docs/azure-devops/README.md)
- [Jenkins docs](docs/jenkins/README.md)

## Repository Structure

The current repository layout is intentionally minimal. Empty directories keep `.gitkeep` placeholders so the structure remains versioned and visible while the lab grows.

```text
delivery-platform-lab/
├── .github/
│   └── workflows/
│       └── .gitkeep
├── azure-devops/
│   ├── pipelines/
│   │   ├── .gitkeep
│   │   ├── environment-validation.yml
│   │   └── multicloud-deployment-plan.yml
│   └── templates/
│       ├── .gitkeep
│       ├── check-required-paths.yml
│       ├── multicloud-plan-stage.yml
│       ├── validate-environment-stage.yml
│       └── validate-monorepo.yml
├── deployments/
│   ├── aws/
│   │   └── .gitkeep
│   ├── azure/
│   │   └── .gitkeep
│   ├── common/
│   │   └── .gitkeep
│   └── gcp/
│       └── .gitkeep
├── docs/
│   ├── .gitkeep
│   ├── azure-devops/
│   │   └── README.md
│   └── jenkins/
│       └── README.md
├── environments/
│   ├── dev/
│   │   └── .gitkeep
│   ├── prod/
│   │   └── .gitkeep
│   └── staging/
│       └── .gitkeep
├── jenkins/
│   ├── pipelines/
│   │   └── .gitkeep
│   └── shared-libraries/
│       └── .gitkeep
├── modules/
│   └── shared/
│       └── .gitkeep
├── platform/
│   ├── scripts/
│   │   └── .gitkeep
│   └── tooling/
│       └── .gitkeep
├── .gitignore
├── azure-pipelines.yml
└── README.md
```

### What Each Path Is For

- `.github/workflows/` stores GitHub Actions workflows when repository-level automation is needed.
- `azure-devops/` contains Azure DevOps-specific pipelines and reusable templates.
- `azure-devops/pipelines/environment-validation.yml` validates the expected structure for `dev`, `staging`, and `prod`.
- `azure-devops/pipelines/multicloud-deployment-plan.yml` previews the intended AWS, Azure, and GCP delivery flow without deploying anything.
- `azure-devops/templates/` holds reusable Azure DevOps building blocks for path validation and stage composition.
- `deployments/common/` is reserved for shared deployment assets used across cloud targets.
- `deployments/aws/`, `deployments/azure/`, and `deployments/gcp/` isolate provider-specific deployment logic.
- `docs/` contains supporting documentation and platform-focused documentation sections.
- `docs/azure-devops/` is the documentation entry point for Azure DevOps-related guidance in this lab.
- `docs/jenkins/` is the documentation entry point for Jenkins-related guidance in this lab.
- `environments/dev/`, `environments/staging/`, and `environments/prod/` hold environment-specific overlays, values, and future deployment inputs.
- `jenkins/` is reserved for Jenkins pipelines and shared library assets.
- `modules/shared/` is for reusable automation or infrastructure modules that should not belong to a single CI engine.
- `platform/scripts/` stores shared operational scripts used by pipelines.
- `platform/tooling/` is for platform-level helper utilities and support tooling.
- `azure-pipelines.yml` is the main Azure DevOps entry point for validating the repository baseline.
- `.gitignore` defines repository ignore rules.
- `README.md` documents the repository purpose, structure, and operating model.

## Operating Direction

The intended direction is simple: each CI platform orchestrates from its own domain, but reusable delivery logic should not be duplicated in every engine. When automation stops being one-off and starts repeating, it should move into `platform/` or `modules/`. That keeps the monorepo useful both as an orchestration layer and as a catalog of shared delivery capabilities.

An expected evolution flow for future changes looks like this:

1. Define the pipeline or deployment need.
2. Implement the minimum entry point in the appropriate CI engine.
3. Extract repeated steps into reusable templates or modules.
4. Version environment conventions in `environments/`.
5. Grow from validation into promotion, release, and deployment flows as the lab matures.

## Azure DevOps in This Monorepo

Azure DevOps is one of the primary orchestration engines in the repository, not an isolated add-on. Its current role is to provide a reusable pipeline baseline that validates the expected monorepo structure and demonstrates how common capabilities can be composed through templates.

The current Azure DevOps convention is:

- `azure-pipelines.yml` as the root Azure DevOps entry point.
- `azure-devops/templates/` for reusable jobs and shared steps.
- `azure-devops/pipelines/` for pipelines organized by capability, environment, or operating domain.

## Current Azure DevOps Starter

The current foundation is split into three complementary entry points:

- `azure-pipelines.yml` validates the structural contract of the monorepo and requires the core Azure DevOps pipelines to exist.
- `azure-devops/pipelines/environment-validation.yml` validates the expected baseline for `dev`, `staging`, and `prod`.
- `azure-devops/pipelines/multicloud-deployment-plan.yml` validates the multi-cloud foundation and publishes a preview of the AWS, Azure, and GCP flow without performing any deployment.

All three rely on small reusable templates for path checks and keep the current focus on fundamentals: validate structure, express flow, and prevent early drift.

### Environment Validation Pipeline

This pipeline exists to protect the minimum environment contract. For each of `dev`, `staging`, and `prod`, it validates that:

- the environment overlay exists in `environments/<environment>/`;
- the versioned placeholder remains present so empty directories stay visible in Git;
- the shared delivery baseline (`deployments/common`, `platform/scripts`, and `modules/shared`) is still available.

It does not build, package, or deploy. Its only job is to stop changes that break the minimum structure expected by each environment.

### Multi-Cloud Deployment Plan Pipeline

This pipeline models the future delivery flow without requiring real credentials. It first validates the shared foundation and then runs three independent previews:

- AWS: checks `deployments/aws` together with the `dev`, `staging`, and `prod` overlays.
- Azure: checks `deployments/azure` together with the `dev`, `staging`, and `prod` overlays.
- GCP: checks `deployments/gcp` together with the `dev`, `staging`, and `prod` overlays.

Each preview writes the intended order `common -> cloud -> environments` to the logs with `credentials=not-required` and `deployment=disabled`. That makes the target architecture visible before real cloud providers are connected.

### Quick Start

1. Create an Azure DevOps pipeline that points to the root `azure-pipelines.yml` file.
2. Keep the default branch as `main` so triggers and pull request validation stay aligned.
3. Create additional pipelines for `azure-devops/pipelines/environment-validation.yml` and `azure-devops/pipelines/multicloud-deployment-plan.yml` if you want to separate responsibilities.
4. Update the `requiredPaths` lists in the YAML files whenever the monorepo structural contract changes.
5. Add new templates in `azure-devops/templates/` when repeated patterns emerge.

## Growth Criteria

As the lab grows, these rules should stay in place:

- do not mix environment configuration with pipeline logic;
- do not duplicate identical steps across CI engines;
- keep each template small, auditable, and easy to recombine;
- use `docs/` to record architecture decisions when cloud, product, or compliance variants appear.

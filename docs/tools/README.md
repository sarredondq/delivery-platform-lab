# CI/CD Tools Overview

This directory contains documentation for each CI/CD tool used in the Delivery Platform Lab. The goal is to implement the same build-test-deploy pipeline across multiple tools to compare their approaches, strengths, and trade-offs.

## Tools Summary

| Tool | Status | Config Location | Notes |
|------|--------|-----------------|-------|
| Azure DevOps | Next | `pipelines/azure-devops/` | YAML pipelines defined in-repo |
| GitHub Actions | Planned | `.github/workflows/` + `pipelines/github-actions/` | Workflow files must live in `.github/workflows/`; helper scripts and docs in `pipelines/` |
| Jenkins | Planned | `pipelines/jenkins/` | Jenkinsfile-based pipelines |
| CircleCI | Planned | `.circleci/config.yml` + `pipelines/circleci/` | Config must live at `.circleci/config.yml`; docs and orb configs in `pipelines/` |
| ArgoCD | Planned | TBD | GitOps-based continuous delivery for Kubernetes |

> **Config location note:** Some tools (GitHub Actions, CircleCI) require their pipeline config files in specific repository paths. In those cases, the `pipelines/{tool}/` directory contains documentation, helper scripts, and auxiliary configurations, while the actual pipeline definition lives where the tool requires it.

## Tool Descriptions

### Azure DevOps

Microsoft's DevOps platform with integrated CI/CD, boards, repos, and artifacts. Pipelines are defined in YAML and support multi-stage deployments, approvals, and environments. Strong integration with Azure cloud services.

**What makes it different:** Unified platform (pipelines + boards + repos + artifacts). Deep Azure integration with service connections and managed identity support.

### GitHub Actions

Event-driven CI/CD built into GitHub. Workflows are triggered by repository events (push, PR, schedule, etc.) and defined in YAML under `.github/workflows/`. Rich marketplace of community-maintained actions.

**What makes it different:** Native GitHub integration. Event-driven model goes beyond CI/CD (issue management, releases, automation). Massive ecosystem of reusable actions.

### Jenkins

The original open-source automation server. Self-hosted with a vast plugin ecosystem. Pipelines defined as code via `Jenkinsfile` using Groovy-based DSL. Extremely flexible but requires more operational overhead.

**What makes it different:** Self-hosted and fully customizable. Largest plugin ecosystem. Complete control over the build environment. Higher operational cost.

### CircleCI

Cloud-native CI/CD platform with a focus on speed and developer experience. Uses a centralized config file at `.circleci/config.yml`. Orbs provide reusable, parameterized pipeline components.

**What makes it different:** Orbs ecosystem for reusable pipeline logic. Strong Docker-native workflows. Excellent caching and parallelism features.

### ArgoCD

GitOps-based continuous delivery tool for Kubernetes. Monitors Git repositories and automatically syncs the desired state to Kubernetes clusters. Declarative and auditable.

**What makes it different:** GitOps model — Git is the single source of truth. Kubernetes-native. Automatic drift detection and self-healing.

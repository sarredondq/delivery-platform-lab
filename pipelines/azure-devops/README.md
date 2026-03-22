# Azure DevOps Pipelines

CI/CD pipeline configuration for the Delivery Platform Lab using Azure DevOps YAML pipelines.

## Pipeline Architecture

The pipelines follow a three-stage separation of concerns:

```
PR opened ──> CI ──> Tests pass? ──> Merge to main ──> CD ──> Artifact published
                                                                      │
                                                         Git tag (v*) │
                                                                      ▼
                                                                   Release
                                                                   ├── Validate
                                                                   └── Deploy
                                                                       ├── AWS
                                                                       ├── Azure
                                                                       └── GCP
```

| Type | Trigger | Purpose |
|------|---------|---------|
| **CI** | PR targeting `main` | Install, lint, test, build — validate code quality |
| **CD** | Push to `main` (merge) | Build a deployable artifact and publish it |
| **Release** | Git tag `v*` or manual | Validate artifacts and deploy to cloud environments |

## Pipeline Files

| File | Type | App | Trigger | What it does |
|------|------|-----|---------|--------------|
| `ci/api-ci.yml` | CI | API | PR → `main` (paths: `apps/api/**`) | Install deps, run tests, publish coverage |
| `ci/web-ci.yml` | CI | Web | PR → `main` (paths: `apps/web/**`) | Install deps, run tests, build, publish coverage |
| `cd/api-cd.yml` | CD | API | Push to `main` (paths: `apps/api/**`) | Install prod deps, publish source as artifact |
| `cd/web-cd.yml` | CD | Web | Push to `main` (paths: `apps/web/**`) | Build with Vite, publish `dist/` as artifact |
| `release/release.yml` | Release | Both | Git tag `v*` | Validate + deploy to AWS / Azure / GCP (placeholder) |

## Templates Structure

Templates are split into two levels for maximum reusability:

### Step Templates (`templates/steps/`)

Low-level, single-responsibility steps:

| Template | Purpose | Key Parameters |
|----------|---------|----------------|
| `install-node.yml` | Install Node.js + `npm ci` | `nodeVersion`, `workingDirectory` |
| `run-tests.yml` | Run `test:ci`, publish test results + coverage | `workingDirectory` |
| `build-app.yml` | Run the build command | `workingDirectory`, `buildCommand` |

### Job Templates (`templates/jobs/`)

Higher-level jobs that compose step templates:

| Template | Purpose | Key Parameters |
|----------|---------|----------------|
| `ci-node-app.yml` | Full CI job (install → test → build) | `appName`, `appPath`, `nodeVersion`, `runBuild` |
| `build-artifact.yml` | Full CD job (install → build → publish artifact) | `appName`, `appPath`, `artifactName`, `runBuild`, `artifactPath` |

### Template Resolution

Azure DevOps resolves `template:` paths **relative to the file that references them**, not the repo root. The current structure accounts for this:

- `ci/api-ci.yml` references `../templates/jobs/ci-node-app.yml` — resolves correctly
- Job templates reference `../steps/install-node.yml` — resolves correctly (relative to `templates/jobs/`)

## Connecting to Azure DevOps

### Setting Up Pipelines

1. Go to **Azure DevOps** > your project > **Pipelines** > **New Pipeline**
2. Select **GitHub** (or Azure Repos Git) as the source
3. Select this repository
4. Choose **"Existing Azure Pipelines YAML file"**
5. Browse to the specific YAML file (e.g., `pipelines/azure-devops/ci/api-ci.yml`)
6. Save and run

Repeat for each pipeline file (you'll have 5 pipelines total).

### Important Notes

- **Path-based triggers** only work when the YAML file is present in the **default branch** (usually `main`). The first pipeline run must be from `main` for path filters to activate.
- **PR triggers** defined in YAML (`pr:` section) only work for **Azure Repos Git**. For GitHub repos, configure PR triggers in the Azure DevOps pipeline settings UI instead.
- **Name your pipelines** clearly in Azure DevOps (e.g., `API - CI`, `Web - CD`) so the dashboard is easy to read.
- The **release pipeline** currently uses placeholder scripts. Fill in actual deployment steps as you build out the `infra/` directory.

### Recommended Pipeline Names

| YAML File | Suggested Pipeline Name |
|-----------|------------------------|
| `ci/api-ci.yml` | `API - CI` |
| `ci/web-ci.yml` | `Web - CI` |
| `cd/api-cd.yml` | `API - CD` |
| `cd/web-cd.yml` | `Web - CD` |
| `release/release.yml` | `Release - Multi-Cloud` |

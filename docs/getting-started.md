# Getting Started

This guide covers how to set up and run the Delivery Platform Lab applications locally.

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime for API and frontend build tooling |
| npm | 10+ (ships with Node 20) | Package manager |

## Clone the Repository

```bash
git clone <repository-url>
cd delivery-platform-lab
```

## API (`apps/api`)

### Install Dependencies

```bash
cd apps/api
npm install
```

### Run the Server

```bash
npm start
```

The API starts on `http://localhost:3000` by default. You can override the port with the `PORT` environment variable.

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Returns `{ "status": "ok", "timestamp": "..." }` |
| `/info` | GET | Returns `{ "name": "...", "version": "...", "environment": "..." }` |

### Run Tests

```bash
npm test
```

Tests use Jest with coverage thresholds set at 80% for branches, functions, lines, and statements.

For CI environments:

```bash
npm run test:ci
```

## Frontend (`apps/web`)

### Install Dependencies

```bash
cd apps/web
npm install
```

### Run the Dev Server

```bash
npm run dev
```

The frontend starts on `http://localhost:5173` and connects to the API to display its health status.

### Build for Production

```bash
npm run build
```

Output is written to `dist/`.

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm test
```

Tests use Vitest with React Testing Library. Coverage thresholds are set at 80%.

For CI environments:

```bash
npm run test:ci
```

## Environment Variables

### API (`apps/api`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port the API server listens on |
| `NODE_ENV` | `development` | Environment name (`development`, `production`, `test`) |

### Frontend (`apps/web`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000` | Base URL for the API. Must be set when deploying to non-local environments. |

> **Note:** Vite environment variables must be prefixed with `VITE_` to be exposed to the client. Set them in a `.env` file at `apps/web/.env` or pass them at build time.

# Money Tracker

A full-stack money tracking application built with Express.js (backend) and Next.js (frontend) in a monorepo structure.

## Structure

```
money-tracker/
├── packages/
│   └── backend/          # Express.js TypeScript API
│       ├── src/
│       │   ├── routes/   # API routes
│       │   ├── controllers/ # Route controllers
│       │   ├── middleware/   # Express middleware
│       │   ├── models/   # Data models
│       │   ├── utils/    # Utility functions
│       │   └── types/    # TypeScript type definitions
│       └── dist/         # Compiled output
└── frontend/             # Next.js app (to be added)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies for all packages
npm install
```

### Development

```bash
# Start both backend and frontend in development mode
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend (when available)
npm run dev:frontend
```

### Build

```bash
# Build all packages
npm run build

# Build only backend
npm run build:backend

# Build only frontend (when available)
npm run build:frontend
```

## API

### Health Check
- `GET http://localhost:3001/health` - Server health status

### API Info
- `GET http://localhost:3001/api` - Basic API information

## Environment Variables

Copy `.env.example` to `.env` in the backend directory:

```bash
cp packages/backend/.env.example packages/backend/.env
```

## Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build all packages
- `npm run start` - Start production servers
- `npm run clean` - Clean build outputs
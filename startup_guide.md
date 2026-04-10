# Startup Guide

Our group would like to highlight that environment variables would typically be in a secrets manager.
This step has been omitted for the sake of convenience, the specified database is locked to the free tier without valuable information.

## Setup

1. Create .env from .env.sample

```bash
# from root directory
cp backend/.env.sample backend/.env
```

2. Build shared packages

```bash
# from root directory
cd shared
npm install
npm run build
```

3. Install required packages

```bash
# from root directory
cd frontend && npm install

# from root directory
cd backend && npm install
```

4. Start both the frontend and the backend

```bash
# from root directory
cd frontend && npm run dev

# in another terminal from root directory
cd backend && npm run dev
```

# CPS630 Auction Platform

## Overview and Goals

Our application is an auction platform, where users can sign up, create auctions,
bid on active auctions, and view results in real-time. Our group took this assignment
as a challenge to build a production-ready system, with the following considerations:

- Extensibility: Implemented TypeScript and utilized necessary abstractions
- Testability: Defined interfaces within TypeScript (`backend/src/types`, `frontend/src/types`) to allow for test doubles to be created (ex. `backend/src/__fixtures__`)
- Security: Database-backed authentication and authorization implemented with JWT on the REST API and websocket communications
- Latency: Real-time websocket updates propagated to all users watching the same auction

## Rationale for using TypeScript

The scope of this application greatly exceeds that of our previous application. To
maintain control over this complexity, our group utilized additional abstractions to
facilitate modular development and ease of testing. We accept the greater tooling
complexity that comes with this decision, in hopes that it will increase correctness
of the application and increase developer velocity going forward. The cost of setup
is greatly outweighed by the future benefits.

## App Structure

Our application closely follows the given monorepo structure. We have dedicated
folders for both the frontend, backend, and an additional module named `shared`.

The shared module contains our domain types, test fixtures, and validation schemas
that are used both within the frontend and backend, following the DRY principle. This
module must be built into `@auction-platform/shared` (done with yarn build within
the shared module) before running the other modules.

## Rationale for using the Repository Pattern and Layered Architecture

The repository pattern helps to structure our code within the backend. This pattern
aims to solve three of our biggest problems:

1. Folder structure:
   The application is divided into three distinct layers, the repositories, the
   services, and the handlers. Within `backend/src`, we have dedicated folders for
   each layer, removing ambiguity that would be present otherwise.

2. Abstraction of business logic from the application logic:
   Each layer clearly communicates the expectations and its own guarantees within its
   defined interface (`backend/src/types`). This is an example of good modular
   development, as each concrete implementation of an interface can be switched for
   another.

3. Testability:
   In tests, the real services can easily be switched for test doubles (generally
   fakes and mocks in our case), isolating the component that is actually being tested.

## Rationale for Client-Side API Abstraction

Our client-side communication with the backend lives within a React context (called
a "provider"). This context lives in the root of the client application, effectively
allowing all children to access it with the `useApi()` hook. This enables our frontend
developers to communicate with the REST API and websockets in a similar fashion, without
having to worry about the different paradigms of each method of communication.

## Project Components, Views, and Services

### Frontend Views

The frontend is built with React, React Router, and Vite. It consists of the
following pages:

- **LoginPage** (`frontend/src/components/LoginPage.tsx`) — Email/password login form
  that authenticates the user and stores a JWT token.
- **SignupPage** (`frontend/src/components/SignupPage.tsx`) — Registration form for new
  users with name, email, and password fields.
- **DashboardPage** (`frontend/src/components/DashboardPage.tsx`) — The main landing
  page after login. Displays three sections: active auctions (LIVE), the user's
  participated auctions (HISTORY), and concluded auctions (INACTIVE).
- **AuctionRoomView** (`frontend/src/components/AuctionRoomView.tsx`) — The real-time
  bidding interface for a single auction. Shows auction details, current price, a bid
  input field, and a live-updating bid history powered by Socket.io.
- **BalancePage** (`frontend/src/components/BalancePage.tsx`) — Allows users to view
  and add funds to their account balance.

Supporting dashboard components live in `frontend/src/components/dashboard/` and include
`AuctionItem`, `MyAuctionItem`, `InactiveAuctionItem`, `Navbar`, `SearchAuctions`,
`AddBalanceModal`, `StatusBadge`, and `EmptyState`.

### Frontend Services

The frontend's API layer is organized under `frontend/src/providers/`:

- **AuthProvider** (`providers/auth/index.tsx`) — React context managing user session
  state, JWT token storage, and login/signup/logout actions. All authenticated
  components access it via `useAuth()`.
- **ApiContextProvider** (`providers/api/index.tsx`) — Combines the REST client and
  WebSocket hook into a single context. Components use `useApi()` to call any backend
  operation without worrying about the underlying transport.
- **REST client** (`providers/api/rest.ts`) — Wraps `fetch` calls to the backend REST
  API (`getUserInfo`, `addToBalance`, `getAuction`, `createAuction`, `searchAuctions`).
- **Socket hook** (`providers/api/useSocketApi.ts`) — Manages the Socket.io connection
  lifecycle, auction room subscriptions (`joinAuction`, `leaveAuction`), and bid
  submission (`bidOnAuction`). It also tracks live bid state and connection status.

### Backend Services

The backend is built with Express, Socket.io, and MongoDB via Mongoose. It follows
a layered architecture: **Models -> Services -> Handlers**.

**Models** (`backend/src/models/`):
- `User.ts` — MongoDB schema for users (email, hashed password, balance, participated
  auctions).
- `Auction.ts` — MongoDB schema for auctions with an embedded bids array, indexed for
  efficient querying by active status, price, and end time.

**Services** (`backend/src/services/`):
- `user.service.ts` — User creation with bcrypt password hashing, balance management,
  and profile retrieval.
- `auction.service.ts` — Auction CRUD, search/filter with text and price range queries,
  bid placement with balance validation, and auction closure processing.
- `queue.service.ts` — In-memory queue that schedules auction expiry callbacks at each
  auction's end time, ensuring auctions automatically close.
- `socket.service.ts` — Broadcasts real-time events (new bids, auction closures) to
  all users subscribed to an auction room via Socket.io.

**REST Handlers** (`backend/src/handlers/rest/`):
- `POST /auth/signup` and `POST /auth/login` — Authentication endpoints.
- `GET /me` and `PATCH /me/balance` — User profile and wallet operations.
- `POST /auctions` and `GET /auctions` — Auction creation and search.
- `middleware.ts` — JWT auth middleware (`requireAuth`), Zod schema validation
  (`validate`), and a global error handler.

**Socket Handlers** (`backend/src/handlers/sockets/`):
- `joinAuction` — Subscribes a user to an auction's Socket.io room.
- `bidOnAuction` — Validates and places a bid, then broadcasts it to the room.
- `leaveAuction` — Unsubscribes a user from the auction room.

### Shared Module

The `shared/` package (`@auction-platform/shared`) is built with Babel and TypeScript
and contains code used by both the frontend and backend:

- **Domain types** (`shared/src/domain/`) — TypeScript interfaces for `Auction`, `User`,
  `Bid`, and Socket.io event contracts (`ClientToServerEvents`, `ServerToClientEvents`).
- **Validation schemas** (`shared/src/schemas/`) — Zod schemas for auction creation,
  user signup/login, bid parameters, and search filters. These are used on the backend
  for request validation and on the frontend for form validation.

## Overview/Reflection

Please see `startup_guide.md` on how to run the project.

Our team built a real-time auction platform to meet the assignment requirements: authentication, form creation, live bidding, and result viewing.

On the backend, the repository pattern and layer architecture allowed us to develop
and test each service individually. The service interfaces allowed us to swap real implementation for mock test services during our development. The queue service handles auction lifecycle automatically. The Socket.io rooms keep all connected users in sync without polling.

On the frontend, the provider pattern (AuthProvider and ApiContextProvider) gave every
component access to authentication state and backend operations through simple hooks. This meant individual page components could focus on rendering and user interaction. React Router handles client-side navigation.

### Successes

- Ensuring real-time two-way communication between the client and server during live auctions
- Bids placed by any user are immediately reflected in the auction room
- Real-time socket events are persisted to MongoDB on every bid
- Implemented authentication across both the REST API and WebSocket connections
- Working in iterations as a group to break the project into manageable phases (authentication, auction CRUD, real-time bidding, UI polish)

### Challenges

- Connecting the frontend with the socket handlers to ensure real-time updates arrive
promptly required management auction room subscriptions and state synchronization
- Organizing package dependencies across multiple devices for testing was difficult because different workspaces caused some install failures
- Testing socket communication revealed edge cases that were not obvious right away
- Delegating tasks across group members while ensuring everyone had a meaningful role

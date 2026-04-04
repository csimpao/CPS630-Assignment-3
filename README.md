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

1. Folder structure
   The application is divided into three distinct layers, the repositories, the
   services, and the handlers. Within `backend/src`, we have dedicated folders for
   each layer, removing ambiguity that would be present otherwise.

2. Abstraction of business logic from the application logic
   Each layer clearly communicates the expectations and its own guarantees within its
   defined interface (`backend/src/types`). This is an example of good modular
   development, as each concrete implementation of an interface can be switched for
   another.

3. Testability
   In tests, the real services can easily be switched for test doubles (generally
   fakes and mocks in our case), isolating the component that is actually being tested.

## Rationale for Client-Side API Abstraction

Our client-side communication with the backend lives within a React context (called
a "provider"). This context lives in the root of the client application, effectively
allowing all children to access it with the `useApi()` hook. This enables our frontend
developers to communicate with the REST API and websockets in a similar fashion, without
having to worry about the different paradigms of each method of communication.

# Social App: Monolithic to Serverless Microservices Transformation

## Overview

This document describes the transformation journey of a **MERN stack social app** from a monolithic architecture to serverless microservices. The app was initially built as a single monolithic application and then refactored into independent microservices deployed as serverless functions using OpenFaaS.

---

## Development Phases

### Phase 1: Monolithic Full-Stack Application

#### Architecture
- **Frontend:** React.js application for UI/UX.
- **Backend:** Node.js with Express for API and MongoDB for data storage.

#### Features
1. **Authentication Routes:** Registration, login, and session management.
2. **Post Routes:** CRUD operations for posts.
3. **User Routes:** Profile management and user-specific operations.

#### Deployment
- Entire application (frontend and backend) was deployed as a single unit.

---

### Phase 2: Separation into Frontend and Server

#### Objective
Decouple the frontend and backend to enable independent scalability and streamlined development workflows.

#### Changes Made
1. **Frontend:**
   - Isolated into a standalone application using the same configuration.
   - Communicates with the backend using REST APIs.
2. **Backend:**
   - Retained all routes (auth, posts, users) as a single Express application initially.
   - Configured for CORS to handle frontend requests.

#### Benefits
- Simplified frontend and backend scaling.
- Easier maintenance and debugging.

---

### Phase 3: Splitting Backend into Microservices

#### Objective
Transform the monolithic backend into distinct microservices for modularity and maintainability.

#### Changes Made
- Divided the backend into three separate Express-based applications:
  1. **Auth Routes:** Handles user authentication and authorization.
  2. **Post Routes:** Manages posts (CRUD operations).
  3. **User Routes:** Handles user profiles and related features.

#### Benefits
- Each service became an independently deployable and scalable application.
- Reduced coupling between features.

---

### Phase 4: Converting Microservices into Serverless Functions

#### Objective
Leverage serverless architecture for cost efficiency and scalability.

#### Changes Made
- Each microservice (auth, posts, users) was converted into an individual serverless function.
- **OpenFaaS** was used to deploy and manage these serverless functions.
- Each function retained its Express-like behavior to handle requests independently.

#### Deployment
- Functions were deployed as independent serverless endpoints.
- Each function is capable of running independently and responding to HTTP requests.

---

## Final Architecture

### Components
1. **Frontend (React):**
   - Standalone React app interacting with backend endpoints.

2. **Serverless Functions:**
   - **Auth Function:** Handles user authentication logic.
   - **Post Function:** Manages post-related operations.
   - **User Function:** Handles user profile management.

### Tools and Technologies
- **Frontend:** React.js, Axios (for API calls), Material ui.
- **Backend:** Node.js, Express, MongoDB.
- **Serverless Deployment:** OpenFaaS, Docker, Kubernatece.

---

## Commands and Scripts

### Running and function on local machine
```bash
# Install dependencies
npm install

npm run start
npm run development



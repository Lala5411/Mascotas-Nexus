# Mascota Nexus

This repository contains a Java/Spring backend in `backend/` and a React frontend in `frontend/`.

## Copilot harness

- Read `README.md` for the agent, skill, spec, and quality-check map.
- Workspace agents are in `.github/agents/`; their tool allow-lists define the tools available for each role.
- Reuse a skill from `.github/skills/` when its description matches the task. Backend service rules are covered by `spring-service-testing`; accessible React work by `react-accessible-flows`; adoption submission/review flows by `adoption-flow-validation`.
- The five features use the repository's `specs/NN-*/spec.md`, `plan.md`, and `tasks.md` structure. Spec Kit is not used.

## Engineering rules

- Keep changes inside the relevant module and preserve the controller/service/repository boundaries in the backend.
- Validate user input at the API boundary and enforce adoption invariants in `SolicitudService`.
- Use DTOs for new API responses instead of exposing persistence entities.
- Keep frontend API calls consistent with the existing `http://localhost:8080/api` base URL and use the authenticated user's ID rather than fixed IDs.
- Add focused tests for changed behavior; do not replace meaningful tests with snapshots or assertions of implementation details.
- Do not change database credentials, ports, password encoding, or unrelated authentication behavior.
- Do not add reports, presentations, diagrams, or other narrative deliverables to code changes.

## Validation commands

- Backend: `cd backend` then `./mvnw test` (Windows: `.\mvnw.cmd test`).
- Frontend tests: `cd frontend` then `npm test -- --watchAll=false`.
- Frontend production build: `cd frontend` then `npm run build`.
- Browser end-to-end tests: `cd frontend` then `npm run test:e2e` (requires the isolated E2E PostgreSQL database configured by Playwright).

The backend uses Java 17, Spring Boot, Spring Data JPA, and PostgreSQL. The frontend uses React, Axios, and Tailwind CSS.

---
name: adoption-flow-validation
description: Validates adoption application forms, persistence, status transitions, and applicant-visible outcomes in Mascota Nexus.
---

# Adoption flow validation

Use this skill when changing application data, submission rules, application history, or administrator decisions.

1. Keep application invariants in `SolicitudService`; validate required fields, allowed values, availability, and duplicate pending applications on the server.
2. Keep new API response shapes in DTOs and verify persisted data through the relevant read endpoint.
3. In React tests, mock Axios and assert what an adopter or administrator can see, including loading and error feedback.
4. In Playwright tests, use unique users and pets, verify approval and rejection outcomes in the adopter's history, and clean up only the isolated E2E database.
5. Run `.\mvnw.cmd test` from `backend/`, then `npm test -- --watchAll=false` and `npm run build` from `frontend/`.
6. When the browser workflow or API contract changes, run `npm run test:e2e` from `frontend/` and report any unavailable test infrastructure explicitly.

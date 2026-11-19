---
name: react-accessible-flows
description: Builds accessible and testable React workflows for the Mascota Nexus frontend.
---

# React accessible flows

1. Give each control an accessible name and expose loading, error, and empty states with suitable status or alert roles.
2. Mock Axios at the component boundary and test user-visible outcomes with React Testing Library.
3. Verify requests use the current session's stored user ID and preserve the configured API URL.
4. Test stale asynchronous responses when a selection change can start overlapping requests.
5. Run `npm test -- --watchAll=false` and `npm run build` from `frontend/`.

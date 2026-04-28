# Strengthen axiosInstance with token refresh & error shaping

## Summary
Centralize auth token handling and normalized API errors.

## Tasks
- [ ] Add request/response interceptors to refresh tokens and attach auth headers
- [ ] Shape server errors into typed APIError
- [ ] Prevent token refresh race (single refresh promise)
- [ ] Add tests for 401 -> refresh -> retry flow

## Files / places to check
- src/utils/axiosInstance.ts
- src/lib/auth.ts

## Priority
priority/P1

## Estimate
estimate/M

## Acceptance criteria
- 401 responses trigger a single refresh, retry succeeds, errors have consistent shape

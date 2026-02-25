# Add CI for lint / tsc / tests

## Summary
Protect main branch with CI that runs lint, typecheck, and tests.

## Tasks
- [ ] Add GitHub Action (done in .github/workflows/ci.yml)
- [ ] Configure required status checks on branch protection
- [ ] Add test scripts / fix failing tests

## Priority
priority/P0

## Estimate
estimate/S

## Acceptance criteria
- PRs are blocked when CI fails; typecheck and lint run on every PR

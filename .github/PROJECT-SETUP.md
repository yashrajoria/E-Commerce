# GitHub Project setup (recommended)

Create a GitHub Project board (Projects v2) with columns:
- Backlog
- Ready
- In Progress
- PR Review
- QA
- Done

Labels:
- area/* (auth, cart, ux, infra)
- priority/P0..P3
- estimate/S/M/L
- bug / enhancement / task / documentation

Workflow:
- Create Notion spec pages for large tasks; link Notion URL in the issue body.
- Create issues from Notion cards and add them to the Project board.
- PRs must reference the issue ID and link back to the Project card.

Sample issues are in .github/sample-issues/ — copy their content to create real issues.

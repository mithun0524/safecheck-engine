# SafeCheck Git Rules

Never:
- force push
- reset user work
- delete unrelated changes
- overwrite unrelated modifications
- commit secrets
- commit .env files

## Change Discipline
Only modify files necessary for the task.
Do not fix unrelated problems.
Do not perform unrelated refactors.

## Before Completion
Inspect:
git diff

Check:
- intended files changed
- no secrets
- no debug code
- no accidental changes
- no generated junk

## Commits
Prefer focused commits.
Use conventional commit style where appropriate:
feat:
fix:
test:
refactor:
docs:
security:
chore:

Never create a commit merely to hide incomplete work.

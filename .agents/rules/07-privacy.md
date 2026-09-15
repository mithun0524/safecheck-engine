# SafeCheck Privacy Rules

Privacy is a product requirement.

## Default
Do not store raw user content unless explicitly required.

Do not log raw:
- messages
- URLs
- credentials
- tokens
- cookies
- authorization headers

## Data Minimization
Only collect data necessary for the requested analysis.
Prefer derived evidence over storing raw input.

## Logging
Logs should contain:
- request ID
- operation
- detector ID
- duration
- status
- error category

Logs should NOT contain raw user content.

## API
Never expose:
- API keys
- internal credentials
- provider secrets
- private infrastructure details

## Retention
Every stored user-related field must have a documented reason to exist.
If a field does not have a clear purpose: do not store it.

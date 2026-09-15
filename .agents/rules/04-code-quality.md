# SafeCheck Code Quality Rules

Prefer:
- explicit types
- pure functions
- small modules
- dependency injection
- interfaces
- deterministic behavior
- readable code
- meaningful names

Avoid:
- any
- giant functions
- god classes
- global mutable state
- magic numbers
- duplicated business logic
- circular dependencies
- unnecessary abstractions

## Dependencies
Before adding a dependency ask:
1. Do we actually need it?
2. Can existing code solve this?
3. Is it maintained?
4. Is the license compatible?
5. Does it introduce security risk?
6. Does it materially increase complexity?

Minimize dependencies.

## Error Handling
Never silently swallow errors.
Errors must either:
- be handled
- be returned
- be transformed into a defined domain result
- or be logged safely

Never expose secrets or raw sensitive input in errors.

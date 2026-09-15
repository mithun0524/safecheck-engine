# Contributing to SafeCheck

First off, thank you for considering contributing to SafeCheck!

## Ground Rules

Before writing any code, please review our agent rules in `.agents/rules/`. Specifically:
1. **Security First**: Review `.agents/rules/02-security.md`. All contributions must treat data as untrusted.
2. **Architecture**: Review `.agents/rules/01-architecture.md`. Do not add dependencies or change architecture without an ADR.
3. **Testing**: Review `.agents/rules/03-testing.md`. All new functionality requires tests.

## Getting Started

1. Fork the repository.
2. Clone your fork.
3. Run `pnpm install`.
4. Create a branch for your feature (`git checkout -b feat/your-feature`).

## Pull Request Process

1. Ensure your code conforms to the project's code quality standards (`pnpm lint`).
2. Ensure all tests pass (`pnpm test`).
3. If you've changed security-sensitive code, explicitly mention it in your PR description.
4. Obtain approval from a maintainer before merging.

Thank you for helping keep the digital world safe!

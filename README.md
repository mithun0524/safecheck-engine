# SafeCheck

**Before you click it, check it.**

SafeCheck is an open-source, privacy-first digital trust and scam detection engine. It evaluates digital content (URLs, text, files) to provide evidence-driven risk and confidence scores, empowering users to make informed decisions.

## Development Status

⚠️ **Pre-Production:** SafeCheck is currently under active development. Production functionality is not yet complete.

## MVP Scope

The Minimum Viable Product (MVP) will include:
- Text, URL, and domain analysis
- Deterministic detectors & threat intelligence
- Evidence generation, risk scoring, and confidence scoring
- REST API, CLI, TypeScript SDK, and Web interface

## High-Level Architecture

SafeCheck's core engine is framework-agnostic. The dependency flow strictly enforces:
`apps` → `services` → `packages`

The core engine does not depend on web frameworks (Next.js), databases (PostgreSQL), or external infrastructure.

## Repository Structure

This is a pnpm monorepo.
- `packages/`: Framework-independent core logic, schemas, rules, and analyzers.
- `services/`: Backend API and worker services.
- `apps/`: Web applications and documentation.

## Local Setup & Development

1. Install dependencies: `pnpm install`
2. Run typechecking: `pnpm typecheck`
3. Run linting: `pnpm lint`
4. Run tests: `pnpm test`
5. Build all packages: `pnpm build`

## Documentation

See the `docs/` folder for architectural decisions, product requirements, and technical documentation. See `.agents/rules/` for strict development constraints.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us. Note that the project is currently in the initial scaffolding phase.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

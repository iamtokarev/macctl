# Development and operations

## Local setup

The project is designed for Bun on macOS.

Typical setup from the README:

```bash
git clone https://github.com/serverdaun/macctl.git
cd macctl
bun install
```

Useful local commands from `package.json`:

- `bun run dev` — run the TypeScript entrypoint directly
- `bun run build` — bundle to `dist/`
- `bun run start` — run the built CLI
- `bun run check` — Biome check
- `bun run check:fix` — auto-fix Biome issues
- `bun run release:patch` — bump patch version and create a release commit + tag

## Permissions and platform constraints

This repository targets macOS only. Several features depend on AppleScript or System Events:

- `volume` commands shell out to `osascript`
- `screen lock` simulates a keypress through System Events
- `app` commands use AppleScript and JXA against NSWorkspace

That means the terminal app may need macOS Accessibility permission, especially for screen locking and some app-control flows. The CLI help text calls this out explicitly.

## CI

`.github/workflows/ci.yml` runs on `macos-latest` for pushes and pull requests to `main`.

The validation sequence is:

1. checkout
2. install Bun
3. `bun install --frozen-lockfile`
4. `bun run check`
5. `bun run build`
6. compare the built CLI version to `package.json`

This is the main signal that the package metadata and CLI output remain aligned.

## Publish workflow

`.github/workflows/publish.yml` runs on version tags beginning with `v`.

It performs additional checks before `npm publish`:

- validates the tag format
- confirms the tag matches `package.json` version
- runs the same lint/build/version checks as CI
- publishes with `NODE_AUTH_TOKEN`

## Release script

`scripts/release-patch.ts` is the repo’s release automation entrypoint. It intentionally performs safety checks before changing anything:

- clean worktree required
- current branch must be `main`
- current version must be a plain SemVer `x.y.z`

It then increments the patch version, runs checks, rebuilds, verifies the built CLI version, commits the version bump, and creates an annotated tag.

This script is the canonical place to inspect before modifying release policy.

## Change guidance for future agents

- If you change CLI output or command behavior, update README/OpenWiki examples and re-run `bun run check` plus `bun run build`.
- If you change versioning or release behavior, inspect `src/lib/version.ts`, `scripts/release-patch.ts`, and both workflows together.
- If you add a new command family, update the CLI entrypoint, the README, and the OpenWiki command reference together.

## Source anchors

- `package.json`
- `README.md`
- `.github/workflows/ci.yml`
- `.github/workflows/publish.yml`
- `scripts/release-patch.ts`
- `src/index.ts`
- `src/lib/version.ts`

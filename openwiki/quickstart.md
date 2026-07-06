# OpenWiki quickstart

`macctl` is a small Bun + TypeScript CLI for controlling macOS system state from the terminal. It focuses on explicit, script-friendly commands that emit structured JSON, which makes it suitable for automation and locally running agents.

## What this repository does

The CLI currently supports three command families:

- `volume` — read and set output volume, and control mute state
- `screen` — lock the screen
- `app` — open, focus, quit, inspect, and list running applications

The entrypoint is `src/index.ts`, which wires Commander.js subcommands together and prints a shared JSON result format. Most macOS interaction happens through AppleScript or JavaScript for Automation in `src/lib/`.

## High-level architecture

- **CLI layer:** `src/commands/*.ts`
- **System control logic:** `src/lib/*.ts`
- **Version handling:** `src/lib/version.ts`
- **Release automation:** `scripts/release-patch.ts`
- **CI / publish validation:** `.github/workflows/ci.yml` and `.github/workflows/publish.yml`

The current design assumes macOS and Bun. Some commands, especially app control and screen locking, require macOS Accessibility permissions for the terminal process.

## Start here next

- [Repository architecture](architecture.md)
- [Command reference](commands.md)
- [Development and operations](operations.md)

## Source anchors

- `package.json` for scripts, package metadata, and distribution entrypoint
- `README.md` for user-facing command summaries and release guidance
- `src/index.ts` for top-level command registration and CLI help text
- `src/commands/app.ts`, `src/commands/volume.ts`, `src/commands/screen.ts` for subcommand behavior
- `src/lib/app.ts`, `src/lib/volume.ts`, `src/lib/screen.ts`, `src/lib/applescript.ts` for platform integration
- `.github/workflows/*.yml` and `scripts/release-patch.ts` for release and validation flow

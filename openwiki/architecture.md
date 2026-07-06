# Repository architecture

## Overview

`macctl` is built as a layered Bun CLI:

1. `src/index.ts` creates the Commander program, loads the version from `package.json`, and registers command groups.
2. `src/commands/*.ts` defines the user-facing CLI surface and maps arguments to library calls.
3. `src/lib/*.ts` performs the actual macOS automation using AppleScript or JavaScript for Automation.
4. Command handlers format results through `printResult()` so every success response has the same JSON envelope.

This is intentionally a thin CLI wrapper around platform-specific control logic. The structure keeps command parsing separate from AppleScript details, which should make future commands easier to add.

## CLI and output contract

All command paths use `printResult()` from `src/lib/result.ts`, which currently serializes a single JSON object to stdout. The shared shape is:

- `status`: `success` or `error`
- `action`: a stable action name like `volume.set` or `app.list`
- `message`: human-readable summary
- `data`: structured payload when needed

That contract matters because the README and CLI help explicitly position the tool for scripting and local agents. Future changes should preserve the JSON-first behavior unless there is a deliberate compatibility break.

## System integration boundary

The platform bridge lives in `src/lib/applescript.ts` and `src/lib/exec.ts`:

- `runCommand()` wraps `Bun.spawnSync()` and turns non-zero exits into errors.
- `runAppleScript()` and `runJavaScriptForAutomation()` shell out to `osascript`.

Most functionality is implemented through AppleScript / JXA rather than Node-native macOS APIs. That keeps the dependency surface small, but it also means behavior depends on macOS permissions and the availability of `osascript`.

## Command groups

### Volume
`src/lib/volume.ts` reads and mutates the system output volume state. It uses `get volume settings` to read `outputVolume` and `outputMuted`, then clamps all writes to the `0-100` range.

### Screen
`src/lib/screen.ts` locks the screen by simulating `Control+Command+Q` through System Events.

### App
`src/lib/app.ts` works with `NSWorkspace` and AppleScript to open, focus, quit, query, and list apps. It treats the user-provided string as a macOS display name, not a bundle ID or executable name.

## Versioning and releases

`src/lib/version.ts` discovers `package.json` and reads the package version for `--version`. This same version is validated in CI against the built CLI.

`scripts/release-patch.ts` automates patch releases by:

- requiring a clean worktree
- requiring the `main` branch
- bumping `package.json` patch version
- running `bun run check` and `bun run build`
- verifying the built CLI reports the expected version
- creating a release commit and annotated tag

This release script is important because the repo publishes from tags and the publish workflow rechecks that tag and `package.json` agree.

## Where to look when changing the architecture

- Add a new command group: start in `src/commands/` and `src/lib/`, then register it in `src/index.ts`
- Change output format: inspect `src/lib/result.ts` and every `printResult()` call site
- Adjust macOS behavior: inspect the relevant file in `src/lib/` and test on a Mac with the needed permissions
- Adjust versioning or release flow: inspect `src/lib/version.ts`, `scripts/release-patch.ts`, and the GitHub workflows

## Source anchors

- `src/index.ts`
- `src/commands/app.ts`
- `src/commands/volume.ts`
- `src/commands/screen.ts`
- `src/lib/app.ts`
- `src/lib/volume.ts`
- `src/lib/screen.ts`
- `src/lib/applescript.ts`
- `src/lib/exec.ts`
- `src/lib/result.ts`
- `src/lib/version.ts`
- `scripts/release-patch.ts`

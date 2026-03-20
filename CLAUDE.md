# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`macctl` is a macOS CLI tool for controlling system settings (volume, screen, etc.) via AppleScript. Built with Bun + TypeScript + [Commander.js](https://github.com/tj/commander.js). All commands output structured JSON.

## Commands

```sh
bun run src/index.ts         # run in dev
bun run build                # compile to dist/
bun run lint                 # biome lint
bun run check                # biome check (lint + format)
bun run check:fix            # auto-fix biome issues
bun link                     # install `macctl` globally via bun link
```

No tests exist yet. Use `bun test` when adding them.

## Architecture

```
src/
  index.ts           # Entry point — registers commands with Commander
  commands/          # CLI layer: parse args, validate, call lib, printResult()
  lib/
    exec.ts          # runCommand() — wraps Bun.spawnSync
    applescript.ts   # runAppleScript() — wraps osascript via runCommand()
    result.ts        # CommandResult type + printResult() (JSON output)
    validate.ts      # ensureVolume() validator
    volume.ts        # Volume control logic via AppleScript
    screen.ts        # Screen lock via AppleScript keystroke
```

**Adding a new command:**
1. Add logic to a new `src/lib/<feature>.ts` — use `runAppleScript()` for system control
2. Create `src/commands/<feature>.ts` — define Commander subcommands, call lib, call `printResult()`
3. Register in `src/index.ts` with `program.addCommand(create<Feature>Command())`

**Key conventions:**
- All output is JSON via `printResult()` — never use `console.log` directly in commands
- AppleScript (`osascript`) is the primary mechanism for macOS system interaction
- Commands throw `Error` on invalid input; Commander catches and displays it
- `validate.ts` (`ensureVolume`) is not currently used by commands — `commands/volume.ts` has its own `ensurePercent()`

## Tooling

- **Runtime/package manager:** Bun (see CLAUDE.md Bun rules below)
- **Linter/formatter:** [Biome](https://biomejs.dev/) — run `bun run check:fix` to auto-fix

---

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- `Bun.spawnSync` / `Bun.$` instead of `child_process` or `execa`

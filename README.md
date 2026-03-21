# macctl

[![CI](https://github.com/serverdaun/macctl/actions/workflows/ci.yml/badge.svg)](https://github.com/serverdaun/macctl/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/macctl)](https://www.npmjs.com/package/macctl)

A small [Bun](https://bun.com) CLI for controlling a Mac from the terminal. Commands print **structured JSON** so scripts and tools can parse results reliably.

**Agents and voice workflows:** This is a good fit for **locally running agents** (or voice assistants in “tool use” mode) that need safe, explicit control of a MacBook—e.g. adjusting volume or locking the screen—without opening full GUI automation for every action.

## Requirements

- macOS
- [Bun](https://bun.com) installed

## Installation

```bash
npm install -g macctl
# or
bun install -g macctl
```

## Development

Clone and install:

```bash
git clone https://github.com/serverdaun/macctl.git
cd macctl
bun install
```

Run from source:

```bash
bun run dev -- --help
```

Install globally from source:

```bash
bun link
```

## Commands

### Volume

| Command | Description |
|--------|-------------|
| `macctl volume get` | Current output volume and mute state |
| `macctl volume set <0-100>` | Set volume |
| `macctl volume up [amount]` | Increase (default +5) |
| `macctl volume down [amount]` | Decrease (default −5) |
| `macctl volume mute <state>` | `state`: `on`, `off`, or `toggle` |

### Screen

| Command | Description |
|--------|-------------|
| `macctl screen lock` | Lock the screen |

### App

| Command | Description |
|--------|-------------|
| `macctl app open <name>` | Open an application |
| `macctl app focus <name>` | Bring an application to the foreground |
| `macctl app quit <name>` | Quit an application gracefully |
| `macctl app running <name>` | Check whether an application is running |
| `macctl app list` | List visible running applications |

## Output

Successful runs emit JSON with `status`, `action`, `message`, and optional `data`. Example:

```bash
macctl volume get
```

```json
{ "status": "success", "action": "volume.get", "message": "Volume is 42", "data": { "outputVolume": 42, "outputMuted": false } }
```

## Dev scripts

```bash
bun run build      # bundle to dist/
bun run start      # run built CLI
bun run check      # format + lint (Biome)
bun run check:fix  # auto-fix lint/format issues
bun run release:patch  # bump patch version, validate, commit, and tag
```

## Releasing

Create a patch release from a clean `main` branch:

```bash
bun run release:patch
git push origin main --follow-tags
```

# macctl

A small [Bun](https://bun.com) CLI for controlling a Mac from the terminal. Commands print **structured JSON** so scripts and tools can parse results reliably.

**Agents and voice workflows:** This is a good fit for **locally running agents** (or voice assistants in “tool use” mode) that need safe, explicit control of a MacBook—e.g. adjusting volume or locking the screen—without opening full GUI automation for every action.

## Requirements

- macOS  
- [Bun](https://bun.com) installed

## Setup

```bash
bun install
```

Run from source during development:

```bash
bun run dev -- --help
```

To use the `macctl` command globally from this directory:

```bash
bun link
```

(Or run `bun run src/index.ts` / `bun run dev` with arguments as below.)

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

## Output

Successful runs emit JSON with `status`, `action`, `message`, and optional `data`. Example:

```bash
bun run dev volume get
```

## Development

```bash
bun run build    # bundle to dist/
bun run start    # run built CLI
bun run check    # format + lint (Biome)
```


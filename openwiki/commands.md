# Command reference

## Command families

### `macctl volume`
Controls the system output volume, not microphone input.

- `get` returns `outputVolume` and `outputMuted`
- `set <value>` sets an absolute 0-100 volume
- `up [amount]` increases volume by a relative amount, defaulting to 5
- `down [amount]` decreases volume by a relative amount, defaulting to 5
- `mute <state>` accepts `on`, `off`, or `toggle`

Implementation notes:

- Input validation lives in `src/commands/volume.ts` through `ensurePercent()`.
- The library layer in `src/lib/volume.ts` clamps volume writes to `0-100`.
- Commands emit `action` values like `volume.get` and `volume.mute`.

Watch out for:

- Volume commands are stateful because relative changes read the current value first.
- `mute toggle` is nondeterministic by design; `on` and `off` are safer for automation.

### `macctl screen`
Currently exposes `lock` only.

- `lock` sends the `Control+Command+Q` keystroke via System Events
- It returns immediately and does not wait for the lock animation
- It requires Accessibility permission for the terminal process

Implementation notes:

- `src/lib/screen.ts` returns a minimal structured payload `{ method: "keystroke" }`.
- The command description in `src/commands/screen.ts` explicitly calls out the permission requirement.

### `macctl app`
Works with macOS application display names such as `Slack` or `Google Chrome`.

- `open <name>` launches or activates an app
- `focus <name>` currently behaves the same as `open`
- `quit <name>` quits an app if it is running
- `running <name>` reports a boolean `running` value
- `list` returns the sorted list of running app names and a count

Implementation notes:

- `src/lib/app.ts` uses `NSWorkspace.sharedWorkspace.runningApplications` for querying state.
- Name handling is trimmed and escaped before shelling out to AppleScript.
- `app.list` includes background and menu-bar agents because it reads running applications from NSWorkspace.

Watch out for:

- The input is a display name, not a bundle identifier.
- `quit` is graceful and may leave the app prompting for save confirmation.
- `running` should be consumed through `data.running`, not by parsing `message` text.

## Shared CLI behavior

- The top-level program in `src/index.ts` prints help text that frames the CLI as JSON-first and agent-friendly.
- All command handlers call `printResult()` from `src/lib/result.ts`.
- Errors are intended to surface as non-zero exit codes with text on stderr, while success uses stdout JSON.

## Source anchors

- `src/commands/volume.ts`
- `src/lib/volume.ts`
- `src/commands/screen.ts`
- `src/lib/screen.ts`
- `src/commands/app.ts`
- `src/lib/app.ts`
- `src/lib/result.ts`
- `src/index.ts`

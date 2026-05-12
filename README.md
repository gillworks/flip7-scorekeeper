# Flip 7 Scorekeeper

A lightweight web scorekeeper for the card game [Flip 7](https://www.geekyhobbies.com/flip-7-rules/). Add players, score each round from the cards on the table, and keep totals until someone reaches the target score.

This is an unofficial companion app and is not affiliated with The Op Games or Flip 7.

## Features

- Add and remove players during a game
- Track round totals and running game totals
- Score rounds by selecting number cards, modifiers, `x2`, or bust
- Automatically apply the +15 Flip 7 bonus when seven unique number cards are selected
- Enter a manual round score when needed
- Undo a player's most recent round
- Start a new game with the same players or reset everything
- Save the current game automatically in this browser with `localStorage`
- Celebrate the winner with confetti when the target score is reached

## Flip 7 Scoring Reference

The app is designed around the standard Flip 7 scoring flow:

- Busted players score `0` for the round.
- Number cards score their face value.
- `x2` doubles the total from number cards before flat modifiers are added.
- Flat modifiers add their printed value.
- Seven unique number cards trigger the Flip 7 bonus for `+15`.
- The default target score is `200`.

For full game rules, setup, action cards, and examples, use the [Geeky Hobbies Flip 7 rules guide](https://www.geekyhobbies.com/flip-7-rules/).

## Tech Stack

- React 19
- TanStack Router / TanStack Start
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui-style component primitives
- Cloudflare-compatible server entry

## Getting Started

Install dependencies:

```sh
bun install
```

Start the development server:

```sh
bun run dev
```

Build for production:

```sh
bun run build
```

Preview the production build:

```sh
bun run preview
```

Run linting:

```sh
bun run lint
```

Format files:

```sh
bun run format
```

## Project Structure

```text
src/
  components/
    RoundEntry.tsx      Manual score dialog
    ScorePicker.tsx     Card/modifier score controls
    ui/                 Shared UI primitives
  lib/
    flip7.ts            Game state types and localStorage helpers
  routes/
    index.tsx           Main scorekeeper screen
  server.ts             Server entry wrapper
```

## Notes

- Scores are stored only on the current device/browser.
- The app does not model the draw deck or enforce every action-card rule. It focuses on calculating and tracking round scores after players resolve the physical cards.
- A round is committed for every player at once. Any player without a pending score is recorded as `0` for that round.

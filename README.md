# time-tracker

CLI tool til at logge arbejdstid per projekt. Gemmer sessions i JSON og pusher automatisk til GitHub ved stop.

## Krav

- [Bun](https://bun.sh) installeret

## Installation

```bash
git clone https://github.com/rasmusskriver/time-tracker.git
cd time-tracker
bun install  # installerer kun bun-types (dev dependency)
```

## Brug

```bash
bun start              # Start session (default projekt: boot.dev)
bun start <projekt>    # Start session for specifikt projekt
bun stop               # Stop aktiv session + auto-push til GitHub
bun status             # Vis aktiv session og elapsed tid
bun report             # Ugentlig rapport med mål og procent
bun report:day         # Daglig rapport (kun tid, ingen mål)
```

## Mål

Ugentlige timemål sættes i `goals.json`:

```json
{
  "boot.dev": {
    "weeklyHours": 5
  }
}
```

Tilføj flere projekter ved at kopiere blokken med et nyt projektnavn.

## Data

- `data/log.json` — alle afsluttede sessions
- `data/session.json` — aktiv session (slettes ved stop)

Ved `bun stop` committer og pusher den automatisk `data/log.json` til GitHub.

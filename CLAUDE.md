# CLAUDE.md — time-tracker

## Hvad er dette?

CLI time tracker skrevet i TypeScript, kørt med Bun. Logger arbejdstid per projekt i JSON-filer og pusher automatisk til GitHub ved stop.

## Projektstruktur

```
src/
  index.ts    # Entry point, kommando-dispatcher
  timer.ts    # startSession / stopSession logik
  log.ts      # Læs/skriv sessions til JSON-filer
  report.ts   # Ugentlig og daglig rapport
  goals.ts    # Læser goals.json + dato-utilities
  git.ts      # git add/commit/push efter stop
data/
  log.json    # Alle afsluttede sessions
  session.json # Aktiv session (lock file, slettes ved stop)
goals.json    # Ugentlige timemål per projekt
```

## Kommandoer

```bash
bun start [projekt]   # Start session (default: boot.dev)
bun stop              # Stop + auto-push til GitHub
bun status            # Vis aktiv session
bun streak            # Streak rapport
bun report            # Ugentlig rapport
bun report:day        # Daglig rapport
```

## Dataformat

**data/log.json** — array af sessions:

```json
[
  {
    "project": "boot.dev",
    "start": "2026-03-27T20:00:00.000Z",
    "end": "2026-03-27T21:00:00.000Z"
  }
]
```

**data/session.json** — aktiv session (eksisterer kun mens en session kører):

```json
{ "project": "boot.dev", "start": "2026-03-27T20:00:00.000Z" }
```

## GitHub auto-push

`src/git.ts` kører efter hver `stop`:

1. `git add data/log.json`
2. `git commit -m "Update log [<ISO timestamp>]"`
3. `git push`

Remote er konfigureret til `https://github.com/rasmusskriver/time-tracker.git`.

## Tilføj nyt projekt

Tilføj projektet i `goals.json`:

```json
{
  "boot.dev": { "weeklyHours": 10 },
  "mit-projekt": { "weeklyHours": 5 }
}
```

Herefter kan du køre `bun start mit-projekt`.

import { startSession, stopSession, statusSession } from "./timer.js";
import { weeklyReport, dailyReport, streakReport } from "./report.js";

const command = process.argv[2];
const arg = process.argv[3];

const HAAN = [
  "Sober og kedelig som en gammel mand.",
  "Ja gå du bare videre helt knastør til boot.dev, din tørvetriller.",
  "0 genstande? Hvad er du, mor? Gay.",
  "Helt ædru. Typisk for en der aldrig når sine mål.",
  "Du coder sober? Det er decideret homo.",
  "Tag dog en øl, du falder i søvn over tastaturet.",
  "Ædru coding er for folk der ikke har venner.",
];

const MIDDEL = [
  "Lidt varm i tøjet. Ikke imponerende, men vi arbejder med det.",
  "Halvstanket. Kunne være værre, men du er stadig lidt gay.",
  "Okay, der er liv i dig. Måske. Nu må vi se.",
  "Mellemting. Ligesom dig selv — hverken fugl eller fisk.",
  "Du er ikke helt håbløs. Næsten, men ikke helt.",
];

const HYPE = [
  "LAAAAD OS FUCKING GOOOO!! Boot.dev vil frygte dit navn!",
  "DU ER EN GUD. BOOT.DEV TILHØRER DIG I AFTEN.",
  "GENSTANDE HØJE SOM DINE AMBITIONER — USTOPPELIG!!",
  "FULD SEND!! Tastaturet er dit sværd, boot.dev er fjenden!!",
  "JA MIN DRENG!! DU ER UOVERVINDELIG I AFTEN!!",
  "ABSOLUT VANVITTIGT!! INGEN KAN STOPPE DIG NU!!",
];

function getReaktion(genstande) {
  if (genstande === 0) {
    return HAAN[Math.floor(Math.random() * HAAN.length)];
  } else if (genstande <= 2) {
    return MIDDEL[Math.floor(Math.random() * MIDDEL.length)];
  } else {
    return HYPE[Math.floor(Math.random() * HYPE.length)];
  }
}

async function promptGenstande() {
  const input = prompt("Hvor mange genstande har du drukket? (fx 0, 1, 3):");
  const val = parseInt((input ?? "").trim(), 10);
  if (isNaN(val) || val < 0) {
    console.log("Ugyldigt. Prøv igen.");
    return promptGenstande();
  }
  return val;
}

switch (command) {
  case "start": {
    const genstande = await promptGenstande();
    const reaktion = getReaktion(genstande);
    console.log(`\n${reaktion}\n`);
    startSession(arg ?? "boot.dev");
    break;
  }

  case "stop":
    await stopSession();
    break;

  case "status":
    statusSession();
    break;

  case "report":
    weeklyReport();
    break;

  case "report:day":
    dailyReport();
    break;

  case "streak":
    streakReport();
    break;

  default:
    console.log(
      "Ukendt kommando. Brug: start | stop | status | report | report:day | streak",
    );
    process.exit(1);
}

import { startSession, stopSession, statusSession } from "./timer.js";
import { weeklyReport, dailyReport, streakReport } from "./report.js";
import { readGoals } from "./goals.js";

const command = process.argv[2];
const arg = process.argv[3];

async function promptProject() {
  const goals = readGoals();
  const projects = Object.keys(goals);

  console.log("Vælg projekt:");
  projects.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));
  console.log(`  ${projects.length + 1}. andet (skriv selv)`);

  const input = prompt(`Indtast nummer (1-${projects.length + 1}):`);
  const num = parseInt(input ?? "", 10);

  if (num === projects.length + 1) {
    const custom = prompt("Projektnavn:");
    return (custom ?? "").trim() || "ukendt";
  }

  if (isNaN(num) || num < 1 || num > projects.length) {
    console.log("Ugyldigt valg.");
    process.exit(1);
  }

  return projects[num - 1];
}

switch (command) {
  case "start":
    startSession(arg ?? (await promptProject()));
    break;

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

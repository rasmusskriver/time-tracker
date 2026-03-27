import { startSession, stopSession, statusSession } from "./timer";
import { weeklyReport, dailyReport } from "./report";

const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case "start":
    startSession(arg || "boot.dev");
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

  default:
    console.log("Ukendt kommando. Brug: start | stop | status | report | report:day");
    process.exit(1);
}

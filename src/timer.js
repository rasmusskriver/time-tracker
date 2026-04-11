import {
  readActiveSession,
  writeActiveSession,
  clearActiveSession,
  appendSession,
} from "./log.js";
import { pushToGitHub } from "./git.js";

export function startSession(project) {
  const existing = readActiveSession();
  if (existing) {
    console.log(
      `Der kører allerede en session for "${existing.project}" (startet ${existing.start}).`
    );
    console.log(`Kør "bun stop" for at stoppe den først.`);
    process.exit(1);
  }

  const session = { project, start: new Date().toISOString() };
  writeActiveSession(session);
  console.log(`Session startet for projekt: ${project}`);
  console.log(`Starttid: ${new Date(session.start).toLocaleString("da-DK")}`);

  const drukProjekter = ["alefarm", "øl", "beer", "ale", "bryg", "hops", "ipa", "lager", "stout"];
  const erDruk = drukProjekter.some((ord) => project.toLowerCase().includes(ord));
  const time = new Date().getHours();
  const erSent = time >= 22 || time < 5;

  if (erDruk && erSent) {
    console.log("Du tracker øl sent om aftenen. Respekt — men tag det roligt.");
  } else if (erDruk) {
    console.log("Øl som projekt. Det tæller.");
  } else if (erSent) {
    console.log("Sent igang. Er du sikker på du er skarp nok?");
  }
}

export async function stopSession() {
  const active = readActiveSession();
  if (!active) {
    console.log("Ingen aktiv session. Kør \"bun start\" for at starte en.");
    process.exit(1);
  }

  const end = new Date();
  const start = new Date(active.start);
  const durationMs = end.getTime() - start.getTime();
  const durationMin = Math.round(durationMs / 60000);
  const hours = Math.floor(durationMin / 60);
  const minutes = durationMin % 60;

  appendSession({
    project: active.project,
    start: active.start,
    end: end.toISOString(),
  });

  clearActiveSession();

  console.log(`Session stoppet for projekt: ${active.project}`);
  console.log(
    `Varighed: ${hours > 0 ? `${hours}t ` : ""}${minutes}min`
  );

  await pushToGitHub();
}

export function statusSession() {
  const active = readActiveSession();
  if (!active) {
    console.log("Ingen aktiv session.");
    return;
  }

  const now = new Date();
  const start = new Date(active.start);
  const durationMs = now.getTime() - start.getTime();
  const durationMin = Math.round(durationMs / 60000);
  const hours = Math.floor(durationMin / 60);
  const minutes = durationMin % 60;

  console.log(`Aktiv session: ${active.project}`);
  console.log(`Startet: ${start.toLocaleString("da-DK")}`);
  console.log(`Elapsed: ${hours > 0 ? `${hours}t ` : ""}${minutes}min`);
}

import {
  readActiveSession,
  writeActiveSession,
  clearActiveSession,
  appendSession,
} from "./log";
import { pushToGitHub } from "./git";

export function startSession(project: string): void {
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
}

export async function stopSession(): Promise<void> {
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

export function statusSession(): void {
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

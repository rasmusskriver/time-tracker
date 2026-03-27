import fs from "fs";

const LOG_FILE = "./data/log.json";
const SESSION_FILE = "./data/session.json";

export interface Session {
  project: string;
  start: string;
  end: string;
}

export interface ActiveSession {
  project: string;
  start: string;
}

export function readLog(): Session[] {
  if (!fs.existsSync(LOG_FILE)) return [];
  return JSON.parse(fs.readFileSync(LOG_FILE, "utf-8"));
}

export function writeLog(sessions: Session[]): void {
  fs.writeFileSync(LOG_FILE, JSON.stringify(sessions, null, 2));
}

export function appendSession(session: Session): void {
  const log = readLog();
  log.push(session);
  writeLog(log);
}

export function readActiveSession(): ActiveSession | null {
  if (!fs.existsSync(SESSION_FILE)) return null;
  return JSON.parse(fs.readFileSync(SESSION_FILE, "utf-8"));
}

export function writeActiveSession(session: ActiveSession): void {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
}

export function clearActiveSession(): void {
  if (fs.existsSync(SESSION_FILE)) {
    fs.unlinkSync(SESSION_FILE);
  }
}

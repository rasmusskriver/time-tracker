import fs from "fs";

const LOG_FILE = "./data/log.json";
const SESSION_FILE = "./data/session.json";

export function readLog() {
  if (!fs.existsSync(LOG_FILE)) return [];
  return JSON.parse(fs.readFileSync(LOG_FILE, "utf-8"));
}

export function writeLog(sessions) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(sessions, null, 2));
}

export function appendSession(session) {
  const log = readLog();
  log.push(session);
  writeLog(log);
}

export function readActiveSession() {
  if (!fs.existsSync(SESSION_FILE)) return null;
  return JSON.parse(fs.readFileSync(SESSION_FILE, "utf-8"));
}

export function writeActiveSession(session) {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
}

export function clearActiveSession() {
  if (fs.existsSync(SESSION_FILE)) {
    fs.unlinkSync(SESSION_FILE);
  }
}

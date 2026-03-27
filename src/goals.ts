import fs from "fs";

const GOALS_FILE = "./goals.json";

export interface ProjectGoal {
  weeklyHours: number;
}

export interface Goals {
  [project: string]: ProjectGoal;
}

export function readGoals(): Goals {
  if (!fs.existsSync(GOALS_FILE)) return {};
  return JSON.parse(fs.readFileSync(GOALS_FILE, "utf-8"));
}

export function getStartOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = søndag
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // mandag
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getStartOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

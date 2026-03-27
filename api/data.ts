import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

interface Session {
  project: string;
  start: string;
  end: string;
}

interface Goals {
  [project: string]: { weeklyHours: number };
}

function getStartOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function durationHours(s: Session): number {
  return (new Date(s.end).getTime() - new Date(s.start).getTime()) / 3600000;
}

function computeStreaks(log: Session[], goals: Goals): Record<string, number> {
  const streaks: Record<string, number> = {};
  const now = new Date();

  const oldest = log.reduce<Date | null>((min, s) => {
    const d = new Date(s.start);
    return min === null || d < min ? d : min;
  }, null);

  for (const project of Object.keys(goals)) {
    const goal = goals[project].weeklyHours;
    let streak = 0;
    let weekOffset = 1; // start på forrige uge

    while (true) {
      const refDate = new Date(now);
      refDate.setDate(refDate.getDate() - weekOffset * 7);
      const weekStart = getStartOfWeek(refDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      if (oldest && weekEnd < oldest) break;

      const hours = log
        .filter(
          (s) =>
            s.project === project &&
            new Date(s.start) >= weekStart &&
            new Date(s.start) < weekEnd
        )
        .reduce((sum, s) => sum + durationHours(s), 0);

      if (hours >= goal) {
        streak++;
      } else {
        break;
      }

      weekOffset++;
    }

    streaks[project] = streak;
  }

  return streaks;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const logPath = path.join(process.cwd(), "data", "log.json");
  const goalsPath = path.join(process.cwd(), "goals.json");

  const log: Session[] = fs.existsSync(logPath)
    ? JSON.parse(fs.readFileSync(logPath, "utf-8"))
    : [];

  const goals: Goals = fs.existsSync(goalsPath)
    ? JSON.parse(fs.readFileSync(goalsPath, "utf-8"))
    : {};

  const streaks = computeStreaks(log, goals);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({ log, goals, streaks });
}

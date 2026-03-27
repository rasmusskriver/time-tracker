import { readLog, Session } from "./log";
import { readGoals, getStartOfWeek, getStartOfDay } from "./goals";

function durationHours(session: Session): number {
  const start = new Date(session.start).getTime();
  const end = new Date(session.end).getTime();
  return (end - start) / 3600000;
}

function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}t`;
  return `${h}t ${m}min`;
}

export function weeklyReport(): void {
  const log = readLog();
  const goals = readGoals();
  const weekStart = getStartOfWeek();

  const thisWeek = log.filter(
    (s) => new Date(s.start) >= weekStart
  );

  const totals: Record<string, number> = {};
  for (const session of thisWeek) {
    totals[session.project] = (totals[session.project] || 0) + durationHours(session);
  }

  console.log(`\nUgentlig rapport (uge fra ${weekStart.toLocaleDateString("da-DK")})`);
  console.log("─".repeat(40));

  const allProjects = new Set([...Object.keys(totals), ...Object.keys(goals)]);
  if (allProjects.size === 0) {
    console.log("Ingen sessioner denne uge.");
    return;
  }

  for (const project of allProjects) {
    const logged = totals[project] || 0;
    const goal = goals[project]?.weeklyHours;
    const bar = goal
      ? ` [${formatHours(logged)} / ${goal}t mål]`
      : ` [${formatHours(logged)}]`;
    const pct = goal ? ` (${Math.round((logged / goal) * 100)}%)` : "";
    console.log(`  ${project}:${bar}${pct}`);
  }
  console.log();
}

export function dailyReport(): void {
  const log = readLog();
  const dayStart = getStartOfDay();

  const today = log.filter(
    (s) => new Date(s.start) >= dayStart
  );

  const totals: Record<string, number> = {};
  for (const session of today) {
    totals[session.project] = (totals[session.project] || 0) + durationHours(session);
  }

  console.log(`\nDaglig rapport (${new Date().toLocaleDateString("da-DK")})`);
  console.log("─".repeat(40));

  if (Object.keys(totals).length === 0) {
    console.log("Ingen sessioner i dag.");
    return;
  }

  for (const [project, hours] of Object.entries(totals)) {
    console.log(`  ${project}: ${formatHours(hours)}`);
  }
  console.log();
}

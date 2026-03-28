import { readLog, Session } from "./log";
import { readGoals, getStartOfWeek, getStartOfDay } from "./goals";

function durationHours(session: Session): number {
  const start = new Date(session.start).getTime();
  const end = new Date(session.end).getTime();
  return (end - start) / 3600000;
}

function formatHours(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
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

function progressBar(value: number, max: number, width: number = 20): string {
  const pct = Math.min(value / max, 1);
  const filled = Math.round(pct * width);
  const empty = width - filled;
  return "[" + "█".repeat(filled) + "░".repeat(empty) + "]";
}

export function streakReport(): void {
  const log = readLog();
  const goals = readGoals();
  const goalProjects = Object.keys(goals);

  if (goalProjects.length === 0) {
    console.log("Ingen projekter med mål i goals.json.");
    return;
  }

  // Find den tidligste session for at vide hvor langt vi kan gå tilbage
  const oldest = log.reduce<Date | null>((min, s) => {
    const d = new Date(s.start);
    return min === null || d < min ? d : min;
  }, null);

  if (!oldest) {
    console.log("Ingen sessions i loggen.");
    return;
  }

  console.log(`\nStreak rapport`);
  console.log("─".repeat(40));

  for (const project of goalProjects) {
    const goal = goals[project].weeklyHours;
    let streak = 0;
    let weekOffset = 0;
    const now = new Date();

    // Gå bagud uge for uge
    while (true) {
      const refDate = new Date(now);
      refDate.setDate(refDate.getDate() - weekOffset * 7);
      const weekStart = getStartOfWeek(refDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      // Stop hvis vi er før den ældste session
      if (weekEnd < oldest) break;

      // Nuværende uge tæller ikke — kun afsluttede uger
      if (weekOffset === 0) {
        weekOffset++;
        continue;
      }

      const sessionsThisWeek = log.filter(
        (s) => s.project === project && new Date(s.start) >= weekStart && new Date(s.start) < weekEnd
      );

      const hoursThisWeek = sessionsThisWeek.reduce(
        (sum, s) => sum + durationHours(s),
        0
      );

      if (hoursThisWeek >= goal) {
        streak++;
      } else {
        break;
      }

      weekOffset++;
    }

    // Check om indeværende uge allerede er på vej til at opfylde målet
    const thisWeekStart = getStartOfWeek(now);
    const thisWeekSessions = log.filter(
      (s) => s.project === project && new Date(s.start) >= thisWeekStart
    );
    const thisWeekHours = thisWeekSessions.reduce(
      (sum, s) => sum + durationHours(s),
      0
    );
    const thisWeekPct = Math.round((thisWeekHours / goal) * 100);
    const bar = progressBar(thisWeekHours, goal);

    const streakLabel =
      streak === 0
        ? "ingen streak endnu"
        : `★ ${streak} uge${streak !== 1 ? "r" : ""} i træk`;

    let weekStatus: string;
    if (thisWeekHours >= goal) {
      weekStatus = `${bar} ${formatHours(thisWeekHours)} / ${goal}t (${thisWeekPct}%) — streak forlænges!`;
    } else {
      const mangler = goal - thisWeekHours;
      weekStatus = `${bar} ${formatHours(thisWeekHours)} / ${goal}t (${thisWeekPct}%) — mangler ${formatHours(mangler)}`;
    }

    console.log(`  ${project}`);
    console.log(`    Streak:     ${streakLabel}`);
    console.log(`    Denne uge:  ${weekStatus}`);
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

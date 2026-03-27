import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const logPath = path.join(process.cwd(), "data", "log.json");
  const goalsPath = path.join(process.cwd(), "goals.json");

  const log = fs.existsSync(logPath)
    ? JSON.parse(fs.readFileSync(logPath, "utf-8"))
    : [];

  const goals = fs.existsSync(goalsPath)
    ? JSON.parse(fs.readFileSync(goalsPath, "utf-8"))
    : {};

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({ log, goals });
}

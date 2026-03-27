const fs = require("fs");
const { exec } = require("child_process");

const LOG_FILE = "./log.json";
const project = process.argv[2] || "default";

// Hent eksisterende log
let log = [];
if (fs.existsSync(LOG_FILE)) {
  log = JSON.parse(fs.readFileSync(LOG_FILE));
}

// Start session
const startTime = new Date();
console.log(
  `Session started for project: ${project} at ${startTime.toISOString()}`,
);

// Gem session ved exit
process.on("exit", () => {
  const endTime = new Date();
  log.push({
    project,
    start: startTime.toISOString(),
    end: endTime.toISOString(),
  });
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));

  // Push til GitHub (forudsætter git remote er opsat)
  exec(
    'git add log.json && git commit -m "Update log" && git push',
    (err, stdout, stderr) => {
      if (err) console.error(err);
      else console.log("Log pushed to GitHub.");
    },
  );
});

// Keep process alive
setInterval(() => {}, 1000);

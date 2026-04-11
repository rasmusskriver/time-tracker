import { exec } from "child_process";

export function pushToGitHub() {
  return new Promise((resolve, reject) => {
    const cmd = `git add data/log.json && git commit -m "Update log [${new Date().toISOString()}]" && git push`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error("Git push fejlede:", stderr || err.message);
        reject(err);
      } else {
        console.log("Log pushed til GitHub.");
        resolve();
      }
    });
  });
}

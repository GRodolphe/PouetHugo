/**
 * Build script for Cloudflare Pages.
 *
 * Picks the right base URL for the deploy:
 *  - production branch ("main"): the PRODUCTION_URL env var if set,
 *    otherwise the baseURL from hugo.toml
 *  - preview deploys: the per-deploy CF_PAGES_URL
 *
 * Locally, just run `hugo` directly - you don't need this script.
 */

const spawn = require("cross-spawn");
const path = require("path");

const isProduction = process.env.CF_PAGES_BRANCH === "main";
const BASE_URL = isProduction
  ? process.env.PRODUCTION_URL || null
  : process.env.CF_PAGES_URL || null;

console.log(`Using base url "${BASE_URL || "(from hugo.toml)"}"`);

const env = { ...process.env };
env.PATH = `${path.join(__dirname, 'node_modules', '.bin')}:${env.PATH}`;

const args = ["--logLevel", "info", "--cleanDestinationDir", "--minify"];
if (BASE_URL) args.push("-b", BASE_URL);

const cmd = spawn.sync("hugo", args, { encoding: "utf8", env });

if (cmd.stdout) console.log(cmd.stdout);
if (cmd.stderr) console.error(cmd.stderr);

if (cmd.error || cmd.status !== 0) {
  console.error("Failed to build site:", cmd.error || `Hugo exited with code ${cmd.status}`);
  process.exit(1);
}

console.log("Build completed successfully");

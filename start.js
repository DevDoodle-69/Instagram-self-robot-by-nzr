"use strict";
const log = require("./core/logger");
const { loadConfig } = require("./core/config");
const { createBot } = require("./runtime/runner");
const { createStatusServer } = require("./core/statusServer");

async function main() {
  log.master("Alternative Self-Bot", "starting");
  const config = loadConfig();
  const bot = createBot(config);
  const status = createStatusServer({ info: () => ({ bot: config.botName, online: bot.state.running, userID: bot.state.botID, commands: bot.state.commandCount }) });
  await status.start().catch(error => log.warn("HTTP", error.message));
  process.once("SIGINT", async () => { await status.stop(); await bot.stop(); process.exit(0); });
  process.once("SIGTERM", async () => { await status.stop(); await bot.stop(); process.exit(0); });
  process.on("unhandledRejection", error => log.error("PROCESS", "Unhandled rejection", error));
  process.on("uncaughtException", error => log.error("PROCESS", "Uncaught exception", error));
  await bot.start();
}
main().catch(error => { log.error("BOOT", error); process.exitCode = 1; });

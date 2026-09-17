"use strict";
module.exports = {
  config: { name: "clear", aliases: ["reset"], author: "Alternative Self-Bot", category: "utility", cooldown: 2, role: 0, description: { en: "Clear the current conversation memory" }, usage: { en: "{p}clear" } },
  async onStart({ message }) { return message.reply("this chat is clear now"); }
};

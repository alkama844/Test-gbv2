const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

const fancyFontMap = {
  'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
  'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
  '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿',
  ' ': ' ', ',': ',', '.': '.', '!': '!', '?': '?', '-': '-', '_': '_', '(': '(', ')': ')', '[': '[', ']': ']', '{': '{', '}': '}',
  '\n': '\n'
};

function toFancyFont(text) {
  return text.split('').map(c => fancyFontMap[c] || c).join('');
}

function roleTextToString(roleText) {
  switch (roleText) {
    case 0: return toFancyFont("0 (All users)");
    case 1: return toFancyFont("1 (Group administrators)");
    case 2: return toFancyFont("2 (Admin bot)");
    default: return toFancyFont("Unknown role");
  }
}

module.exports = {
  config: {
    name: "helpx",
    version: "1.0",
    author: "A6y & Modded by NAFIJ_PRO( MODED )",
    usePrefix: false,
    role: 0,
    category: "info",
    priority: 1
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += toFancyFont("𝙷𝙴𝙻𝙿 𝙻𝙸𝚂𝚃 𝙱𝚈 𝚇3:\n\n");

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;
        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += toFancyFont(`\n𝙲𝙰𝚃𝙴𝙶𝙾𝚁𝚈: ${category}\n`);
          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 2).map((item) => toFancyFont(`${item}`));
            msg += `\n│${cmds.join(" ".repeat(Math.max(1, 5 - cmds.join("").length)))}`;
          }
        }
      });

      const totalCommands = commands.size;
      msg += toFancyFont(`\n\n╭────────────➣\n\n𝙸 𝙷𝙰𝚅𝙴  ${totalCommands} 𝙲𝙼𝙳𝚂\n𝚃𝚈𝙿𝙴 ☞︎︎︎${prefix}𝚑𝚎𝚕𝚙 𝚝𝚘 𝚟𝚒𝚎𝚠 𝚊𝚕𝚕 𝚌𝚖𝚍𝚜\n➪☁︎╰──────────────➣`);
      msg += toFancyFont(`\n╭──────────────➣\n𝚇2 𝙱𝙾𝚃 𝙲𝚁𝙴𝙰𝚃𝙾𝚁 ☞︎︎︎—͟͞͞NtKhang And Moded By NAFIJ_PRO_✅⸙ ❄︎\n╰──────────────➣`);

      const imageUrl = "https://raw.githubusercontent.com/alkama844/res/refs/heads/main/image/owner.jpg";
      await message.reply({
        body: msg,
        attachment: await axios.get(imageUrl, { responseType: "stream" }).then(res => res.data)
      });

    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(toFancyFont(`Command "${commandName}" not found.`));
      } else {
        const configCommand = command.config;
        const roleStr = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";
        const description = configCommand.longDescription?.en || configCommand.description?.en || "No description";
        const usage = (configCommand.guide?.en || "No guide available.")
          .replace(/{p}/g, prefix)
          .replace(/{n}/g, configCommand.name);

        const info = toFancyFont(`♕︎════════♔︎═════════♕︎
♕︎═══════𝙽𝙰𝙼𝙴════════♕︎
☕︎ ${configCommand.name}
☞︎︎︎ 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽 ☞︎︎︎ ${description}
☞︎︎︎ 𝙰𝙻𝙸𝙰𝚂 ☞︎︎︎ ${configCommand.aliases?.join(", ") || "None"}
☞︎︎︎ 𝙰𝚄𝚃𝙷𝙾𝚁 ☞︎︎︎ ${author}
☞︎︎︎ 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 ☞︎︎︎ ${configCommand.version || "1.0"}
☞︎︎︎ 𝚁𝙾𝙻𝙴 ☞︎︎︎ ${roleStr}
☞︎︎︎ 𝚄𝚂𝙰𝙶𝙴 ☞︎︎︎ ${usage}
♕︎════════♔︎═════════♕︎`);

        await message.reply(info);
      }
    }
  }
};
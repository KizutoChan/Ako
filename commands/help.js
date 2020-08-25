const { MessageEmbed } = require("discord.js");
const GuildSettings = require("../models/settings.js")

module.exports = {
  name: "help",
  aliases: ["h"],
  category: "utility",
  description: "Display all my commands and descriptions",
  async execute(message, args) {

   if (args[0]) {
     const command = message.client.commands.get(args[0]) || message.client.commands.get(message.client.aliases.get(args[0]));

    if (!command) {
      return message.channel.send(`Unknown Command: \`${args[0]}\``);
    }

    if (!command.aliases || command.aliases === null)
      command.aliases = ["Not Provided"]
    
    if (!command.cooldown || command.cooldown === null)
      command.cooldown = ["1"]

    let embed = new MessageEmbed()
      .setAuthor(
        command.name.charAt(0).toUpperCase() + command.name.slice(1),
        message.guild.iconURL({ dynamic: true })
      )
      .addField("Description", command.description || "Not Provided")
      .addField("Aliases", "`" + command.aliases.join(", ") + "`")
      .addField("Cooldown", "`" + command.cooldown + " secs`")
      .setThumbnail(message.client.user.displayAvatarURL())
      .setFooter("Ako | By KizuNyan#2627", message.client.users.cache.get("709995623755022437").displayAvatarURL());

    return message.channel.send(embed);
  } else {
    const commands = await message.client.commands.filter(cmd => !cmd.hidden)

    let cmdExs = ["ping", "play", "loop", "skip", "stop", "permissions", "prefix"]
    let cmdEx = cmdExs[Math.floor(Math.random() * cmdExs.length)];

    let emx = new MessageEmbed()
      .setDescription(`My prefix on this guild is \`${message.client.prefix}\``)
      .setAuthor(`${message.client.user.username} Command list [${commands.array().length}]`, message.guild.iconURL({ dynamic: true }))
      .setFooter(`For more information try ${message.client.prefix}help [command]\nex: ${message.client.prefix}help ${cmdEx}`)
      .setThumbnail(message.client.user.displayAvatarURL());

    let com = {};
    for (let comm of commands.array()) {
      let category = comm.category || "Unknown";
      let name = comm.name;

      if (!com[category]) {
        com[category] = [];
      }
      com[category].push(name);
    }

    for (const [key, value] of Object.entries(com)) {
      let category = key;

      let desc = "`" + value.join("`, `") + "`";

      emx.addField(`${category.charAt(0).toUpperCase() + category.slice(1)} [${value.length}]`, desc);
    }
    
    emx.addField("Links", "[Invite Me](https://discord.com/api/oauth2/authorize?client_id=743046837245575309&permissions=66187072&scope=bot) - [Support Server](https://discord.gg/Y8RUsAX) - [Vote for Us!](https://top.gg/bot/743046837245575309)")
    
    return message.channel.send(emx)

  }
  }
};

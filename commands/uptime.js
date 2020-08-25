const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "uptime",
  category: "utility",
  cooldown: "3",
  description: "Show my uptime",
  async execute(message) {

    const duration = moment
      .duration(message.client.uptime)
      .format("w:d:HH:mm:ss");
    
    const embed = new Discord.MessageEmbed()
      .setAuthor(`Client uptime: ${duration}`, message.client.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter(`Requested by ${message.author.username}`);

    message.channel.send(embed);
    
  }
};
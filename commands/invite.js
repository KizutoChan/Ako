const Discord = require("discord.js");

module.exports = {
  name: "invite",
  category: "utility",
  description: "Invite me to your server",
  execute (message) {
    
    message.channel.send({
      embed: {
        fields: [
        {
          name: `Invite me`,
          value: "[Click Here !](https://discord.com/api/oauth2/authorize?client_id=743046837245575309&permissions=66187072&scope=bot)",
          inline: false,
        }],
        timestamp: new Date(),
        footer: {
          text: `Requested by ${message.author.username}`
        }
      }
    })
  }
};

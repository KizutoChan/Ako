const Prefix = require("../models/settings.js")

module.exports = {
  name: "prefix",
  category: "utility",
  description: "Change my prefix here",
  execute (message, args) {
    
    if (!message.member.hasPermission("MANAGE_GUILD" || "ADMINISTRATOR") || !message.guild.ownerID === message.author.id) {
      return message.reply("You can not use this command")
    }

    if(!args[0]) {
      return message.reply(`Usage: ${message.client.prefix}prefix <New Prefix>`)
    } 
    
    if(args[1]) {
      return message.reply("You can not set prefix with a double argument")
    }
    
    if(args[0].length > 5) {
      return message.reply("You can not send prefix more than 5 characters")
    }
      
    Prefix.findOne({
      guildID: message.guild.id
    }, async (err, prefix) => {
      if (err) console.log(err)

      if (args[0].toLowerCase() === prefix.prefix) {
        message.channel.send(`Prefix already set into **${args[0].toLowerCase()}**`)
      } else {
      
        if (args[0].toLowerCase() === "a!") {
          prefix.prefix = args[0].toLowerCase();
          prefix.save().catch(err=>console.log(err))
          await message.channel.send("Prefix reseted")
        } else {
          prefix.prefix = args[0].toLowerCase();
          prefix.save().catch(err=>console.log(err))
          await message.channel.send(`Prefix has been set into **${args[0].toLowerCase()}**`)
        }
      }
    })
  }
};

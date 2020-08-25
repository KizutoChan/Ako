const Discord = require('discord.js')
const { stripIndents } = require("common-tags")

module.exports = {
    name: "ping",
    category: "utility",
    cooldown: "3",
    description: "Returns latency and API ping",
    async execute(message) {
    
      const Responses = [
        stripIndents`Latency \`$(ping)ms\`
API Latency \`$(heartbeat)ms\``,
        stripIndents`Pong! \`$(ping)ms\`
Foo! \`$(heartbeat)ms\``,
        stripIndents`Firepower--full force!! \`$(ping)ms\`
Doki doki \`$(heartbeat)ms\``,
        stripIndents`A fierce battle makes me want to eat a bucket full of rice afterwards. \`$(ping)ms\`
Heartbeat \`$(heartbeat)ms\``,
        stripIndents`This, this is a little embarrassing... \`$(ping)ms\`
Heartbeat \`$(heartbeat)ms\``
    ];
    
    const msg = await message.channel.send("Pinging...").then(msg => msg.delete())
    
    return message.channel.send(Responses[Math.floor(Math.random() * Responses.length)].replace('$(ping)',((msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)).toString(),).replace('$(heartbeat)', Math.round(message.client.ws.ping).toString()))
  }
}
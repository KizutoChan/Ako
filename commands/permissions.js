const Discord = require("discord.js");
const permissions = Object.keys(Discord.Permissions.FLAGS);
 
module.exports = {
    name: "permissions",
    aliases: ["perms", "perm"],
    category: "utility",
    description: "Show your/someone permissions",
    async execute(message) {
		const member = message.mentions.members.first() || message.author;
		let text = "```\n"+`${member.username}'s permissions in ${message.channel.name}`+"\n\n";
		const mPermissions = message.channel.permissionsFor(member);
		const total = {
			denied: 0,
			allowed: 0
		};
		permissions.forEach((perm) => {
			if(!mPermissions.has(perm)){
				text += `${perm} ❌\n`;
				total.denied++;
			} else {
				text += `${perm} ✅\n`;
				total.allowed++;
			}
		});
		text += `\n${total.allowed} ✅ | ${total.denied} ❌`+"\n```";
		message.channel.send(text);
	}
}
const Discord = require("discord.js")

module.exports = {
    name: "server-list",
    category: "owner",
    aliases: ["slist"],
    hidden: true,
    description: "Show server list",
    async execute(message) {

        await message.delete();

		let i0 = 0;
		let i1 = 10;
		let page = 1;

		let description = 
        `Servers: ${message.client.guilds.cache.size}\n\n`+
		message.client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
			.map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} members`)
			.slice(0, 10)
			.join("\n");

		const embed = new Discord.MessageEmbed()
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setFooter(message.client.user.username + " | By KizuNyan#2627")
			.setTitle(`Page: ${page}/${Math.ceil(message.client.guilds.cache.size/10)}`)
			.setDescription(description);

		const msg = await message.channel.send(embed);
        
		await msg.react("⬅");
		await msg.react("➡");
		await msg.react("❌");

		const collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);

		collector.on("collect", async(reaction) => {

			if(reaction._emoji.name === "⬅") {

				// Updates variables
				i0 = i0-10;
				i1 = i1-10;
				page = page-1;
                
				// if there is no guild to display, delete the message
				if(i0 < -1){
					return msg.delete();
				}
                /*
                if(!i0 || !i1){
					return msg.delete();
				}
                */

				description = `Servers: ${message.client.guilds.cache.size}\n\n`+
				message.client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
					.map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Members`)
					.slice(i0, i1)
					.join("\n");

				// Update the embed with new informations
				embed.setTitle(`Page: ${page}/${Math.ceil(message.client.guilds.cache.size/10)}`)
					.setDescription(description);
            
				// Edit the message 
				msg.edit(embed);
            
			}

			if(reaction._emoji.name === "➡"){

				// Updates variables
				i0 = i0+10;
				i1 = i1+10;
				page = page+1;

				// if there is no guild to display, delete the message
				if(i1 > message.client.guilds.cache.size + 10){
					return msg.delete();
				}
				if(!i0 || !i1){
					return msg.delete();
				}

				description = `Servers: ${message.client.guilds.cache.size}\n\n`+
				message.client.guilds.cache.sort((a,b) => b.memberCount-a.memberCount).map((r) => r)
					.map((r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} members`)
					.slice(i0, i1)
					.join("\n");

				// Update the embed with new informations
				embed.setTitle(`Page: ${page}/${Math.ceil(message.client.guilds.cache.size/10)}`)
					.setDescription(description);
            
				// Edit the message 
				msg.edit(embed);

			}

			if(reaction._emoji.name === "❌"){
				return msg.delete(); 
			}

			// Remove the reaction when the user react to the message
			await reaction.users.remove(message.author.id);

		});

    }
}
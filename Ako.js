/**
 * Module Imports
 */
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const GuildSettings = require("./models/settings.js");
const { TOKEN, VOTE, DBL } = require("./config.json");
const DBLapi = require("dblapi.js");

const client = new Client({ fetchAllMembers: true, disableMentions: "everyone" });

const mongoose = require("mongoose");
const prefix = require("./commands/prefix.js");
mongoose
  .connect(
    "mongodb+srv://KizuuDev:DiaPandaKu@cluster0.sbhsn.mongodb.net/Ako",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(conn => console.log("MongoDB Connected"));

client.login(TOKEN);
client.commands = new Collection();
client.aliases = new Collection();
client.hidden = new Collection();
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Client Events
 */
client.on("ready", () => {

  if(DBL && DBL !== ""){
    let stats = new DBLapi(DBL, client);
    setInterval(function(){
        stats.postStats(client.guilds.cache.size);
    }, 60000*10); // every 10 minutes
    let dbl = new DBLapi(DBL, { webhookPort: VOTE.PORT, webhookAuth: VOTE.PASSWORD });
    dbl.webhook.on("vote", async (vote) => {
        let dUser = await client.users.fetch(vote.user);
        dUser.send(`:arrow_up: Hello ${user.toString()}, thanks for voting !`).catch((err) => {});
        let logsChannel = client.channels.get(VOTE.CHANNEL);
        if(logsChannel){
            logsChannel.send(`:arrow_up: **${user.tag}** (\`${user.id}\`) voted for **${client.user.username}**, thank you!`);
        }
    });
}

  let statuses = ["a!help", "Ako"];
  
  console.log(`${client.user.username} ready!\n- Discriminator: ${client.user.discriminator}\n- ID: ${client.user.id}\n- Servers: ${client.guilds.cache.size}\n- Channels: ${client.channels.cache.size}\n- Users: ${client.users.cache.size}`);

  setInterval(function() {
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    client.user.setActivity({ name: status, type: "LISTENING" })
  }, 5000)
})
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
  if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(alias => client.aliases.set(alias, command.name));
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  
  var storedSettings = await GuildSettings.findOne({
    guildID: message.guild.id
  });
  if (!storedSettings) {
    const newSettings = new GuildSettings({
      guildName: message.guild.name,
      guildID: message.guild.id
    });
    await newSettings.save().catch(() => {});
    storedSettings = await GuildSettings.findOne({ guildID: message.guild.id });
  }
  
  client.prefix = storedSettings.prefix;
  
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)`);
  if (message.content.match(prefixMention)) {
    return message.reply(
      `My prefix on this server is \`${storedSettings.prefix}\``
    );
  }

  const args = message.content.slice(storedSettings.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (message.content.toLowerCase().startsWith(storedSettings.prefix)) {

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args)
    console.log(`${message.author.tag} use a command\nCommand: ${command.name}\nServer: ${message.guild.name}\nChannel: ${message.channel.name}`)
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.").catch(console.error);
  }
}
});

client.on("guildCreate", async (guild) => {
    console.log(`New Guild!\nName: ${guild.name}\nOwner: ${guild.owner.user.tag}\nMembers: ${guild.memberCount}`)
})
client.on("guildDelete", async (guild) => {
    console.log(`Guild Deleted!\nName: ${guild.name}\nOwner: ${guild.owner.user.tag}\nMembers: ${guild.memberCount}`)
})
client.on("guildUpdate", async (guild, newGuild) => {
GuildSettings.findOne({
      guildID: guild.id
    }, async (err, GuildSettings, guildName) => {
      if (err) console.log(err)

      GuildSettings.guildName = newGuild
      GuildSettings.save();
      console.log(`Guild Updated!\nGuild Name: ${newGuild}`)
    })
})
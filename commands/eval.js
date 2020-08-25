const Discord = require("discord.js")

module.exports = {
    name: "eval",
    aliases: ["e", "ev"],
    category: "owner",
    hidden: true,
    description: "Evaluates some code with depth 0",
    async execute(message, args) {

        if (message.author.id !== "709995623755022437") {
            return message.reply("You can not use this command")
        }

        const embed = new Discord.MessageEmbed()

        try {
          let code = args.slice(0).join(" ");
          if (!code)
            return message.channel.send({
              embed: {
                description:
                  "Please include the code."
              }
            });
          let evaled;

          if (
            code.includes(`SECRET`) ||
            code.includes(`TOKEN`) ||
            code.includes(`token`) ||
            code.includes(`secret`)
          ) {
            evaled = "No, shut up, what will you do it with the token?";
          } else {
            evaled = eval(code);
          }

          if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled, { depth: 0 });

          let output = clean(evaled);
          if (output.length > 2048) {
            const { body } = await post("https://hastebin.com/documents").send(
              output
            );
            embed
              .setDescription(`https://hastebin.com/${body.key}.js`)
              .setColor("#55FA51")
          } else {
            embed
              .setDescription("```js\n" + output + "```")
              .setColor("#55FA51")
          }

          let msg = await message.channel.send(embed);

        } catch (error) {
          let err = clean(error);
          if (err.length > 2048) {
            const { body } = await post("https://hastebin.com/documents").send(err);
            embed
              .setDescription(`https://hastebin.com/${body.key}.js`)
              .setColor("#FA5155")
          } else {
            embed
              .setDescription("```js\n" + err + "```")
              .setColor("#FA5155")
          }

          let msg = await message.channel.send(embed);
        }
      }
    };

function clean(string) {
  if (typeof text === "string") {
    return string
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  } else {
    return string;
  }
}

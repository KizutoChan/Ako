const { canModifyQueue } = require("../util/AkoUtil");


module.exports = {
  name: "stop",
  category: "music",
  description: "Stops the music",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} :stop_button: stopped the music!`).catch(console.error);
  }
};

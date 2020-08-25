const { ShardingManager } = require("discord.js");
const { TOKEN } = require("./config.json");

const shards = new ShardingManager("./Ako.js", {
    token: TOKEN,
    autoSpawn: true,
    totalShards: "auto"
});

shards.on("shardCreate", shard => {
  console.log(`Launched shard #${shard.id}`);
});

shards.spawn(shards.totalShards, 30000).catch(err => {
  console.log(err)
});
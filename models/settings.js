const { Schema, model } = require("mongoose");

const guildSettingSchema = new Schema({
  guildName: { type: String },
  guildID: { type: String },
  prefix: { type: String, default: "a!" }
});

module.exports = model("settings", guildSettingSchema);
module.exports = {
  name: "ping",
  description: "Pong!",
  // devOnly: Boolean,
  deleted: true,
  // options: Object[],
  // deleted: Boolean,

  callback: (client, interaction) => {
    interaction.reply(`Pong! ${client.ws.ping}ms`);
  },
};

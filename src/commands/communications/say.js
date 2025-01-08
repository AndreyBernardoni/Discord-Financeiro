const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  deleted: false,
  name: "say",
  description: "O que gostaria que o Bot dissesse?",
  options: [
    {
      name: "texto",
      description: "Texto que o bot irá enviar.",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const text = interaction.options.getString("texto");

    await interaction.channel.send(text);

    await interaction.editReply({
      content: "Mensagem enviada com sucesso!",
      ephemeral: true,
    });
  },
};

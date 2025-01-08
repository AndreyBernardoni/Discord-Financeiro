const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

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
    {
      name: "canal",
      description: "Canal onde a mensagem será enviada.",
      required: false,
      type: ApplicationCommandOptionType.Channel,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const text = interaction.options.getString("texto");
    const channel = interaction.options.getChannel("canal");

    console.log(`Mensagem: ${text}`);
    console.log(`Canal: ${channel}`);

    // Verifica se o canal especificado é um canal de texto
    if (channel && channel.type !== ChannelType.GuildText) {
      return interaction.editReply({
        content: "Por favor, selecione um canal de texto válido.",
        ephemeral: true,
      });
    }

    // Define o canal onde a mensagem será enviada
    const targetChannel = channel || interaction.channel;

    // Envia a mensagem no canal selecionado
    await targetChannel.send(text);

    // Confirma ao usuário que a mensagem foi enviada
    await interaction.editReply({
      content: `Mensagem enviada com sucesso para o canal ${targetChannel}.`,
      ephemeral: true,
    });
  },
};

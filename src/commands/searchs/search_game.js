const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const puppeteer = require("puppeteer");

module.exports = {
  deleted: false,
  name: "search_game",
  description: "Procura um jogo no site mais confiável possível (Confia).",
  options: [
    {
      name: "nome",
      description: "Nome do jogo a ser procurado.",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: false });
    const gameName = interaction.options.getString("nome");
    const gamesList = await searchGame(gameName);

    if (gamesList.length === 0) {
      return interaction.editReply("Nenhum jogo foi encontrado.");
    } else {
      let currentIndex = 0;

      const createEmbed = (game) => {
        return new EmbedBuilder()
          .setTitle(game.title)
          .setURL(game.link)
          .setImage(game.image)
          .setColor("Random")
          .setDescription(`Tags: ${game.tags.join(", ")}`);
      };

      const updateMessage = async () => {
        const embed = createEmbed(gamesList[currentIndex]);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("previous")
            .setLabel("Voltar")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentIndex === 0),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Avançar")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentIndex === gamesList.length - 1)
        );

        await interaction.editReply({
          embeds: [embed],
          components: [row],
        });
      };

      await updateMessage();

      const collector = interaction.channel.createMessageComponentCollector({
        time: 60000,
      });

      collector.on("collect", async (btnInteraction) => {
        if (btnInteraction.user.id !== interaction.user.id) {
          return btnInteraction.reply({
            content: "Você não pode interagir com este botão.",
            ephemeral: true,
          });
        }

        if (btnInteraction.customId === "previous") {
          currentIndex = Math.max(0, currentIndex - 1);
        } else if (btnInteraction.customId === "next") {
          currentIndex = Math.min(gamesList.length - 1, currentIndex + 1);
        }

        await updateMessage();
        await btnInteraction.deferUpdate();
      });

      collector.on("end", async () => {
        const embed = createEmbed(gamesList[currentIndex]);
        await interaction.editReply({
          embeds: [embed],
          components: [],
        });
      });
    }
  },
};

const searchGame = async (gameName) => {
  const browser = await puppeteer.launch({
    executablePath: puppeteer.executablePath(),
    headless: true,
  });
  const page = await browser.newPage();
  console.log("Puppeteer iniciado.", gameName);

  const encodedGameName = gameName?.split(" ").join("+");

  await page.goto("https://game3rb.com/?s=" + encodedGameName);

  console.log("Página carregada.", "https://game3rb.com/?s=" + encodedGameName);

  const gamesFinded = await page.evaluate(() => {
    const games = document.querySelectorAll(".post-hentry");
    const gamesArray = [];

    games.forEach((game) => {
      const tags = game.querySelector(".entry-categories-inner").innerText;
      const tagsArray = tags?.split("\n");

      gamesArray.push({
        title: game.querySelector(".entry-title").innerText,
        link: game.querySelector(".entry-title a").href,
        image: game.querySelector(".entry-image").src,
        tags: tagsArray,
      });
    });

    return gamesArray;
  });

  await browser.close();
  return gamesFinded;
};

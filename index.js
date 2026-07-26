const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

// ==========================
// KONFIGURASI
// ==========================
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// Role yang boleh memakai /announce dan /mapupdate
const allowedRoles = [
  "1488421250958229554",
  "1488421250916159599"
];

// ==========================
// DISCORD CLIENT
// ==========================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ==========================
// ALIAS PANDUAN OWO
// Member tetap mengetik command OWO sendiri.
// ==========================
const owoAliases = {
  wh: "owo hunt",
  hunt: "owo hunt",

  wb: "owo battle",
  battle: "owo battle",

  wz: "owo zoo",
  zoo: "owo zoo",

  wcash: "owo cash",
  owochas: "owo cash",

  winv: "owo inventory",
  inventory: "owo inventory",

  wuse: "owo use <id item> <jumlah>",
  owouse: "owo use <id item> <jumlah>",

  wbuy: "owo buy <id item> <jumlah>",
  wsell: "owo sell <id item> <jumlah>",
  wshop: "owo shop",
  wcrate: "owo crate",

  wcf: "owo coinflip <jumlah>",
  wslots: "owo slots <jumlah>",
  wblackjack: "owo blackjack <jumlah>",

  wlb: "owo leaderboard",
  wtop: "owo leaderboard",

  wmarry: "owo marry @user",
  wdivorce: "owo divorce",
  wcookie: "owo cookie @user",

  wdaily: "owo daily",
  wquest: "owo quest",
  wquests: "owo quests",
  wvote: "owo vote",

  wanimals: "owo animals",
  wgive: "owo give @user <jumlah>",
  wtrade: "owo trade @user",

  wweapon: "owo weapon",
  wweapons: "owo weapon",

  whelp: "owo help",
  owohelp: "owo help",
  wcommands: "owo help"
};

// ==========================
// CEK ROLE STAFF
// ==========================
async function hasPermission(interaction) {
  if (!interaction.guild) return false;

  const member = await interaction.guild.members.fetch(interaction.user.id);

  return allowedRoles.some(roleId =>
    member.roles.cache.has(roleId)
  );
}

// ==========================
// BOT READY + REGISTER SLASH COMMAND
// ==========================
client.once("clientReady", async () => {
  console.log(`${client.user.tag} Online!`);

  const commands = [
    new SlashCommandBuilder()
      .setName("announce")
      .setDescription("Kirim pengumuman dengan tag everyone")
      .addStringOption(option =>
        option
          .setName("pesan")
          .setDescription("Isi pengumuman")
          .setRequired(true)
      )
      .addAttachmentOption(option =>
        option
          .setName("gambar")
          .setDescription("Gambar announcement opsional")
          .setRequired(false)
      ),

    new SlashCommandBuilder()
      .setName("mapupdate")
      .setDescription("Kirim update map")
      .addStringOption(option =>
        option
          .setName("pesan")
          .setDescription("Isi update map")
          .setRequired(true)
      )
      .addAttachmentOption(option =>
        option
          .setName("gambar")
          .setDescription("Gambar update map opsional")
          .setRequired(false)
      )
  ].map(command => command.toJSON());

  try {
    const rest = new REST({ version: "10" }).setToken(TOKEN);

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log("✅ Slash Command berhasil didaftarkan!");
  } catch (error) {
    console.error("❌ Gagal daftar slash command:", error);
  }
});

// ==========================
// SLASH COMMAND HANDLER
// ==========================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    const allowed = await hasPermission(interaction);

    if (!allowed) {
      return interaction.reply({
        content: "❌ Kamu tidak memiliki akses untuk menggunakan command ini.",
        ephemeral: true
      });
    }

    // /announce
    if (interaction.commandName === "announce") {
      const pesan = interaction.options.getString("pesan");
      const gambar = interaction.options.getAttachment("gambar");

      const embed = new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("📢 AFRO NIGHT • ANNOUNCEMENT")
        .setDescription(pesan)
        .setFooter({ text: "Afro Night" })
        .setTimestamp();

      if (gambar) {
        embed.setImage(gambar.url);
      }

      return interaction.reply({
        content: "@everyone",
        embeds: [embed],
        allowedMentions: {
          parse: ["everyone"]
        }
      });
    }

    // /mapupdate
    if (interaction.commandName === "mapupdate") {
      const pesan = interaction.options.getString("pesan");
      const gambar = interaction.options.getAttachment("gambar");

      const embed = new EmbedBuilder()
        .setColor("#8A2BE2")
        .setTitle("🗺️ AFRO NIGHT • MAP UPDATE")
        .setDescription(pesan)
        .setFooter({ text: "Afro Night" })
        .setTimestamp();

      if (gambar) {
        embed.setImage(gambar.url);
      }

      return interaction.reply({
        embeds: [embed]
      });
    }
  } catch (error) {
    console.error("Interaction error:", error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "❌ Terjadi error saat menjalankan command. Cek Railway Logs.",
        ephemeral: true
      });
    }
  }
});

// ==========================
// MESSAGE COMMANDS
// ==========================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const input = message.content.toLowerCase().trim();

  // koyap @user
  if (input.startsWith("koyap")) {
    const user = message.mentions.users.first() || message.author;

    return message.reply({
      content: `📸 Here is ${user.username}'s avatar!`,
      files: [
        user.displayAvatarURL({
          extension: "png",
          size: 4096
        })
      ]
    });
  }
});

// ==========================
// LOGIN BOT
// ==========================
client.login(TOKEN);

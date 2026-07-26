const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Mengirim pengumuman")
    .addAttachmentOption(option =>
      option
        .setName("deskripsi")
        .setDescription("Isi pengumuman")
        .setRequired(true)
    )
    .addAttachmentOption(option =>
      option
        .setName("gambar")
        .setDescription("URL gambar (opsional)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const deskripsi = interaction.options.getString("deskripsi");
    const gambar = interaction.options.getAttachment("gambar");

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("📢 ORBITOR • ANNOUNCEMENT")
      .setDescription(deskripsi)
      .setTimestamp();

    if (gambar) {
      embed.setImage(gambar.url);
    }

    await interaction.reply({
      embeds: [embed]
    });
  },
};

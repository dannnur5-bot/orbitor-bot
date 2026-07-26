const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("WASD")
    .setDescription("Kirim invite WASD")
    .addStringOption(option =>
      option
        .setName("pesan")
        .setDescription("Isi invite WASD")
        .setRequired(true)
    )
    .addAttachmentOption(option =>
      option
        .setName("gambar")
        .setDescription("Upload gambar")
        .setRequired(false)
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Kirim pengumuman")
    .addStringOption(option =>
      option
        .setName("pesan")
        .setDescription("Isi pengumuman")
        .setRequired(true)
    )
    .addAttachmentOption(option =>
      option
        .setName("gambar")
        .setDescription("Upload gambar")
        .setRequired(false)
    )
    .toJSON()
];

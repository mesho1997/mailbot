const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content === "!mail") {
    const name = Math.random().toString(36).substring(2, 10);
    const domain = "1secmail.com";
    const email = `${name}@${domain}`;
    message.reply(`تم إنشاء بريد مؤقت: \`${email}\``);

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${name}&domain=${domain}`);
        if (res.data.length > 0) {
          const mail = res.data[0];
          message.reply(`📧 من: ${mail.from}\nالموضوع: ${mail.subject}`);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Mail error:", err.message);
      }
    }, 15000);
  }
});

client.login(process.env.TOKEN);
const dotenv = require('dotenv');
if(process.env.NODE_ENV !== 'production')
    dotenv.config();

const { CLIENT_TOKEN } = process.env;

const Discord = require("discord.js"); //Conexão com a livraria Discord.js
const client = new Discord.Client(); //Criação de um novo Client
const config = require("./config.json"); //Pegando o prefixo do bot para respostas de comandos
const { readdirSync } = require("fs")

module.exports = (client) => {
    const load = dirs => {
        const commands = readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'));
        for (let file of commands) {
            let pull = require(`../commands/${dirs}/${file}`);
            client.commands.set(pull.config.name, pull);
            if (pull.config.aliases) pull.config.aliases.forEach(a => client.aliases.set(a, pull.config.name));
          };
        };
        ["miscellaneous", "moderation", "owner"].forEach(x => load(x));
};

client.commands = new Discord.Collection();


client.on('message', message => {
     if (message.author.bot) return;
     if (message.channel.type == 'dm') return;
     if (!message.content.toLowerCase().startsWith(config.prefix)) return;
     if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

    const args = message.content
        .trim().slice(config.prefix.length)
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        const commandFile = require(`./commands/${command}.js`)
        commandFile.run(client, message, args);
    } catch (err) {
    console.error('Erro:' + err);
  }
});
client.on("guildMemberAdd", async (member) => { 

  member.roles.add("726478508154421400");

  let guild = await client.guilds.cache.get("723981816788287598");
  let channel = await client.channels.cache.get("723985314300952586");
  let emoji = await member.guild.emojis.cache.find(emoji => emoji.name === "tal");

member.roles.add("724986317921976392");

  if (guild != member.guild) {
    return console.log("Boas vindas pra voce! :3");
   } else {
      let embed = await new Discord.MessageEmbed()
      .setColor("#7c2ae8")
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setTitle(`${emoji} Boas-vindas ${emoji}`)
      .setImage("https://i.imgur.com/IrDN8J4.gif")
      .setDescription(`**${member.user}**, bem-vindo(a) a **${guild.name}**! Atualmente estamos com **${member.guild.memberCount} membros**, leia as regras e se divirta com nosco da Rede Ender! :heart:`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
      .setFooter("Rede Ender")
      .setTimestamp();

    channel.send(embed);
  }
});

client.on("ready", () => {
  let activities = [
      `${config.prefix}help Rede Ender e fazendo uma Stream`,
    ],
    i = 0;
  setInterval( () => client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "PLAYING"
      }), 1000 * 60); 
  client.user
      .setStatus("on")
      .catch(console.error);
console.log("Estou Online!")
});

client.on("guildMemberRemove", async (member) => { 

  let guild = await client.guilds.cache.get("723981816788287598");
  let channel = await client.channels.cache.get("723987452104147054");
  let emoji = await member.guild.emojis.cache.find(emoji => emoji.name === "tal");
  if (guild != member.guild) {
    return console.log("Ahh, foi bom em quanto durou, tchauzinho.");
   } else {
      let embed = await new Discord.MessageEmbed()
      .setColor("RAMDOM")
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setTitle(`${emoji} Adeus! ${emoji}`)
      .setImage("https://i.imgur.com/nh6q0jR.gif")
      .setDescription(`**${member.user.username}**, saiu do servidor! :broken_heart:`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
      .setFooter("Rede Ender")
      .setTimestamp();

    channel.send(embed);
  }

 
});

client.login(CLIENT_TOKEN); //Ligando o Bot caso ele consiga acessar o token
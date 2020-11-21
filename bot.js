const Discord = require('discord.js');
const client = new Discord.Client();


client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  this.bestPlayer = await client.users.fetch('556593706313187338');
  client.user.setActivity('unpublished messages beeing published.', { type: 'WATCHING' });
  client.user.setStatus(0);
});

client.on('message', async message => {
  if (message.channel.type === 'news') {
    message.crosspost();
    return;
  }
  if (message.content.startsWith('ap!') && !message.author.bot) {
    var command = message.content.substring(3);

    if (command === 'help') {
      var embed = {
          embed: {
            color: 0x0000FF,
            title: 'Help',
            author: {
              name: 'Auto Publisher discord bot',
              icon_url: client.user.avatarURL(),
              url: 'https://top.gg/bot/778256454914015245'
            },
            description: 'This is a **bot** that **auto-publishes every message** in an **announcement channel** by either a **bot or a user**.\n\nMight be useful if a bot can\'t publish messages in your announcement channel, either because the bot can\'t do it or you have to pay money.\nPrefix: `ap!`\n\nCommands:\n`help`: Get help command.\n`ping`: Get this bot\'s ping.\n\n\nUseful links:',
            fields: [{
              name: 'Invite the bot!',
              value: '[Discord Bot Invite](https://discord.com/api/oauth2/authorize?client_id=778256454914015245&permissions=8192&scope=bot)'
            }, {
              name: 'Vote for the bot!',
              value: '[Vote here](https://top.gg/bot/778256454914015245/vote)',
              inline: true
            }, {
              name: 'Join the support server!',
              value: '[Join here!](https://discord.gg/NYCvrdedWz)'
            }, {
              name: 'Donate for the free bot!',
              value: '[Patreon](https://www.patreon.com/AutoPublisherDiscordBot)',
              inline: true
            }],
            footer: {
              text: 'Made by bestPlayer_xu#0702',
              icon_url: this.bestPlayer.avatarURL()
            }
        }
      }
      message.channel.send(embed);
    } else if (command === 'ping') {
      message.channel.send({ embed: { description: `🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms` }});
    }
  }
});

client.login(process.env.BOT_TOKEN);

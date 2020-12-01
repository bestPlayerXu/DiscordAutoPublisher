//ya know what this does
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
//make ./data.data a var
var data = JSON.parse(fs.readFileSync('data.data', 'utf8'));

console.log(data);

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  //gets the owner
  this.bestPlayer = await client.users.fetch('556593706313187338');
  //set client presence
  client.user.setPresence({
      activity: { 
          name: 'ap!help',
          type: 'LISTENING'
      },
      status: 'online'
  });
  //sets there username to Auto Publisher
  client.user.setUsername('Auto Publisher');
});

client.on('message', async message => {
    //gets the guild id from data.data file 
  var guild = data[message.guild.id];
  //if there is no guild id there it wil make it then write it to data.data
  if (!guild) {
    data[message.guild.id] = {
      announcements: [],
      prefix: 'ap!'
    };
    guild = data[message.guild.id];
  }
  //when a message is sent see if it is a news channel then see if it is in the announcement channel list in data.data file
  if (message.channel.type === 'news') {
    if (guild.announcements.find(a => a === message.channel.id)) {
      message.crosspost();
    }
    return;
  }
//if it starts with the set prefix for that guild and notbeen sent by a bot execute code in ths if statment 
  if (message.content.startsWith(guild.prefix) && !message.author.bot) {
      //makes the mesage content a var
    var command = message.content.substring(guild.prefix.length).split(' ')[0].toLowerCase();
    //regex confoshong 404 brain not found google it your self 
    var param = message.content.split(/ |\n/g);
    param.shift();
    param = param.map(p => p = p.replace(/<@|<#|>/g, ''));

    var isAdmin = message.member.hasPermission('MANAGE_CHANNELS') || message.author.id === this.bestPlayer.id;
    //the about command
    if (command === 'about') {
      var embed = {
        embed: {
          color: 0x0000FF,
          title: 'About',
          author: {
            name: 'Auto Publisher discord bot',
            icon_url: client.user.avatarURL(),
            url: 'https://top.gg/bot/778256454914015245'
          },
          description: 'This is a **bot** that **auto-publishes every message** in an **announcement channel** by either a **bot or a user**.\n\nMight be useful if a bot can\'t publish messages in your announcement channel, either because the bot can\'t do it or you have to pay money.\n',
          fields: [{
              name: 'Invite the bot!',
              value: '[Discord Bot Invite](https://discord.com/api/oauth2/authorize?client_id=778256454914015245&permissions=93192&scope=bot)'
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
    } 
    //the help command
    else if (command === 'help') {
      var embed = {
          embed: {
            color: 0x0000FF,
            title: 'Help',
            author: {
              name: 'Auto Publisher discord bot',
              icon_url: client.user.avatarURL(),
              url: 'https://top.gg/bot/778256454914015245'
            },
            footer: {
              text: 'Made by bestPlayer_xu#0702',
              icon_url: this.bestPlayer.avatarURL()
            },
            description: 'Prefix: `' + guild.prefix + '`\n\nCommands:\n`add*`: Add an announcement channel where I can auto-publish messages.\n`remove*`: Remove an announcement channel where I can auto-publish messages.\n`view`: View the added announcement channels of this server.\n`ping`: Get this bot\'s ping.\n`prefix`: See this server\'s prefix or change it.\n`help`: Get help command (that\'s this one).\n`about`: Get more info about this bot.\n\nIf you don\'t know how to use a command, just type it without parameter and you\'ll get some help.\n\n*admin commands\n\nMake sure to give the bot the `MANAGE_MESSAGES` the `SEND_MESSAGES` and the `EMBED_LINKS` permission in order to publish and send messages.\n\nIf you have questions, join our [support server](https://discord.gg/NYCvrdedWz)!'
        }
      }
      message.channel.send(embed);
    } 
    //the ping command
    else if (command === 'ping') {
        //gets bot latency and api latency
      message.channel.send({ embed: { description: `🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms` }});
    }
    //the add command 
    else if (command === 'add') {
      if (isAdmin) {
        if (param.length === 0) {
          message.channel.send({ embed: {
            color: 0x0000FF,
            title: 'Add',
            author: {
              name: 'Auto Publisher discord bot',
              icon_url: client.user.avatarURL(),
              url: 'https://top.gg/bot/778256454914015245'
            },
            footer: {
              text: 'Made by bestPlayer_xu#0702',
              icon_url: this.bestPlayer.avatarURL()
            },
            description:  'The `add` command needs (exactly) _one_ parameter. This parameter can be either the id or the #channel.```e.g.: ' + guild.prefix + 'add #MyAnnouncementChannel```or```e.g.' + guild.prefix + 'add 123456789```\nYou can add every channel with `all` as a parameter.```e.g.: ' + guild.prefix + 'add all```'
            }});
          return;
        }
        //gets the channel id from the add command 
        var c = await client.channels.cache.get(param[0]);
        //if the cannel is a news channel exe code in there 
        if (c && c.guild.id === message.guild.id && c.type === 'news') {
            //if its allready been added return 
          if (guild.announcements.find(a => a === param[0])) {
            message.channel.send({ embed: {color:0x0000FF,description: 'No need to add channel <#' + param[0] + '> twice :D'}});
            return;
          }
          //send channel id to data.data and write it 
          guild.announcements.push(param[0]);
          fs.writeFileSync('data.data', JSON.stringify(data, null, 2));
          message.channel.send({ embed: {color:0x0000FF,description: 'Successfully added announcment channel <#' + param[0] + '>'}});
          //if you put all it adds every channel
        } else if (param[0] === 'all') {
          guild.announcements = await client.channels.cache.filter(c => c.guild.id === message.guild.id && c.type === 'news').map(c => c.id);
          message.channel.send({ embed: {color:0x0000FF,description:  'Added every announcement channel.'}});
          fs.writeFileSync('data.data', JSON.stringify(data, null, 2));
        } else {
          message.channel.send({ embed: {color:0x0000FF,description: '<#' + param[0] + '> isn\'t an announcement channel of this server!'}});
        }
      } else {
        message.channel.send({ embed: {color:0x0000FF,description: 'You need the `MANAGE_CHANNELS` permission for that.'}});
      }
      //if your owner ya can get the json data from data.data file
    } else if (command === 'get' && message.author.id === this.bestPlayer.id) {
      message.channel.send(JSON.stringify(data, null, 2));
      //if your owner ya can add some json data to data.data file
    } else if (command === 'set' && message.author.id === this.bestPlayer.id) {
      data = JSON.parse(param.join(''));
      fs.writeFileSync('data.data', JSON.stringify(data, null, 2));
      //if your owner ya can remove some json data from data.data file
    } else if (command === 'remove') {
      if (isAdmin) {
        if (param.length === 0) {
          message.channel.send({ embed: {
            color: 0x0000FF,
            title: 'Remove',
            author: {
              name: 'Auto Publisher discord bot',
              icon_url: client.user.avatarURL(),
              url: 'https://top.gg/bot/778256454914015245'
            },
            footer: {
              text: 'Made by bestPlayer_xu#0702',
              icon_url: this.bestPlayer.avatarURL()
            }, description: 'The `remove` command needs (exactly) _one_ parameter. This parameter can be either the id or the #channel.```e.g.: ' + guild.prefix + 'remove #MyAnnouncementChannel```or```e.g.' + guild.prefix + 'remove 123456789```\nYou can remove every channel with `all` as a parameter.```e.g.: ' + guild.prefix + 'remove all```'}});
          return;
        }
        var c = await client.channels.cache.get(param[0]);
        if (c && c.guild.id === message.guild.id && c.type === 'news') {
          if (guild.announcements.find(a => a === param[0])) {
            guild.announcements = guild.announcements.filter(a => a !== param[0]);
            fs.writeFileSync('data.data', JSON.stringify(data, null, 2));
            message.channel.send({ embed: {color:0x0000FF,description: 'Successfully removed announcment channel <#' + param[0] + '>'}});
          } else {
            message.channel.send({ embed: {color:0x0000FF,description:  '<#' + param[0] + '> isn\'t even an announcement channel I need to auto-publish!'}});
          }
        } else if (param[0] === 'all') {
          guild.announcements = [];
          message.channel.send({ embed: {color:0x0000FF,description:  'Removed every announcement channel.'}});
          fs.writeFileSync('data.data', JSON.stringify(data, null, 2));
        } else {
          message.channel.send({ embed: {color:0x0000FF,description: '<#' + param[0] + '> isn\'t an announcement channel of this server!'}});
        }
      } else {
        message.channel.send({ embed: {color:0x0000FF,description: 'You need the `MANAGE_CHANNELS` permission for that.'}});
      }
      //the view command
    } else if (command === 'view') {
      message.channel.send({ embed: {
        color: 0x0000FF,
        title: 'View',
        author: {
          name: 'Auto Publisher discord bot',
          icon_url: client.user.avatarURL(),
          url: 'https://top.gg/bot/778256454914015245'
        },
        footer: {
          text: 'Made by bestPlayer_xu#0702',
          icon_url: this.bestPlayer.avatarURL()
        }, description: 'I am publishing every message in these channels:\n' + guild.announcements.map(a => '<#' + a + '>').join('\n') + '\n\nAdd or remove channels with the `add` and `remove` command.'
      }});
      //the prefix command
    } else if (command === 'prefix') {
        //if you dont supply a prefix to set 
      if (param.length === 0) {
        message.channel.send({ embed: {
          color: 0x0000FF,
          title: 'View',
          author: {
            name: 'Auto Publisher discord bot',
            icon_url: client.user.avatarURL(),
            url: 'https://top.gg/bot/778256454914015245'
          },
          footer: {
            text: 'Made by bestPlayer_xu#0702',
            icon_url: this.bestPlayer.avatarURL()
          }, description: 'The current prefix for this server is `' + guild.prefix + '`.\n\nChange it with the prefix command together with a new prefix.```e.g.: ' + guild.prefix + 'prefix ap!```\n=> this sets the prefix to `ap!`'
        }});
      } else {
          //if they can manage channels it allows them to set a prefix
        if (isAdmin) {
            //changes the prefix in data.data for that guild id
          guild.prefix = param[0];
          message.channel.send({ embed: {color:0x0000FF,description: 'Set the prefix to `' + guild.prefix + '`.'}});
          //writes the new changes to data.data
          fs.writeFileSync('data.data', JSON.stringify(data, null, 2));
        } else {
            //you havent got permission to do that so sends this embed
          message.channel.send({ embed: {color:0x0000FF,description: 'You need the `MANAGE_CHANNELS` permission for that.'}});
        }
      }
    } else {
      message.channel.send({embed:{color:0x0000FF,description:'The command `' + command + '` doesn\'t exist.'}})
    }
  }
});

client.login(process.env.BOT_TOKEN);

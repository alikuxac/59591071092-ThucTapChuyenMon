const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class VCuserCMD extends Command {
    constructor(client) {
        super(client, {
            name: "vcuser",
            memberName: "vcuser",
            group: "voice",
            description: "Change voice custom channel name",
            guildOnly: true,
            args: [
                {
                    key: "action",
                    prompt: "What do you want to do",
                    type: "string",
                    oneOf: ["allow", "ignore"]
                },
                {
                    key: "user",
                    prompt: "what name do you want to change?",
                    type: "user"
                }
            ]
        })
    }

    async run(message, { action, user }) {
        const VoiceSettings = this.client.provider.getGuild(message.guild.id, "voice");
        const VoiceLog = VoiceSettings.log;
        //get the channel instance from the Member
        const { channel } = message.member.voice;
        //if user not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command");
        const VoiceSearch = this.client.provider.getVCCollection().findOne({ channelID: channel.id });
        if (!VoiceSearch) return message.reply("this is not a custom voice channel");
        if (message.author.id !== VoiceSearch.owner || !message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only owner of this voice can run this command");
        switch (action) {
            case "allow":
                if (user.id === VoiceSearch.owner) return message.reply("you can't do this with owner of channel");
                if (VoiceSearch.user.allowed.includes(user.id)) {
                    channel.updateOverwrite(user.id, {
                        CONNECT: null
                    }).then(newChannel => {
                        this.client.provider.getVCCollection().updateOne(
                            {
                                channelID: channel.id
                            },
                            {
                                $pull: {
                                    "user.allowed": user.id
                                }
                            }
                        ).then(val => {
                            message.reply(`${user.username} is no longer allowed to join this channel`);
                            VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                                embed: new MessageEmbed()
                                    .setAuthor(`${message.author.username}`)
                                    .setTitle("Custom voice channel updated")
                                    .setDescription(`Voice channel \`${channel.name}\` disallowed \`${user.username}\` to join this channel.`)
                                    .setColor("YELLOW")
                                    .setTimestamp()
                            })
                        })
                    })

                } else {
                    channel.updateOverwrite(user.id, {
                        CONNECT: true
                    }).then(newChannel => {
                        this.client.provider.getVCCollection().updateOne(
                            {
                                channelID: channel.id
                            },
                            {
                                $push: {
                                    "user.allowed": user.id
                                }
                            }
                        ).then(val => {
                            message.reply(`${user.username} is allowed to join this channel`);
                            VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                                embed: new MessageEmbed()
                                    .setAuthor(`${message.author.username}`)
                                    .setTitle("Custom voice channel updated")
                                    .setDescription(`Voice channel \`${channel.name}\` allowed \`${user.username}\` to join this channel.`)
                                    .setColor("YELLOW")
                                    .setTimestamp()
                            })
                        })
                    })
                }
                break;
            case "ignore":
                if (user.id === VoiceSearch.owner) return message.reply("you can't do this with owner of channel");
                if (VoiceSearch.user.ignored.includes(user.id)) {
                    channel.updateOverwrite(user.id, {
                        CONNECT: null
                    }).then(newChannel => {
                        this.client.provider.getVCCollection().updateOne(
                            {
                                channelID: channel.id
                            },
                            {
                                $pull: {
                                    "user.ignored": user.id
                                }
                            }
                        ).then(val => {
                            message.reply(`Remove \`${user.username}\` from ignored list successful`);
                            VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                                embed: new MessageEmbed()
                                    .setAuthor(`${message.author.username}`)
                                    .setTitle("Custom voice channel updated")
                                    .setDescription(`Voice channel \`${channel.name}\`owner removed \`${user.username}\` from ignored list `)
                                    .setColor("YELLOW")
                                    .setTimestamp()
                            })
                        })
                    })

                } else {
                    channel.updateOverwrite(user.id, {
                        CONNECT: false
                    }).then(newChannel => {
                        this.client.provider.getVCCollection().updateOne(
                            {
                                channelID: channel.id
                            },
                            {
                                $push: {
                                    "user.ignored": user.id
                                }
                            }
                        ).then(val => {
                            message.reply(`Added \`${user.username}\` to ignored list successful`);
                            VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                                embed: new MessageEmbed()
                                    .setAuthor(`${message.author.username}`)
                                    .setTitle("Custom voice channel updated")
                                    .setDescription(`Voice channel \`${channel.name}\`owner added \`${user.username}\` from ignored list `)
                                    .setColor("YELLOW")
                                    .setTimestamp()
                            })
                        })
                    })
                }

                break;
            default:
                break;
        }


    }
}
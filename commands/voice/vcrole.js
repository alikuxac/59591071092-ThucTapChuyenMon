const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class VCroleCMD extends Command {
    constructor(client) {
        super(client, {
            name: "vcrole",
            memberName: "vcrole",
            group: "voice",
            description: "Allow or ignore role to join this voice channel.",
            args: [
                {
                    key: "action",
                    prompt: "What do you want to do",
                    type: "string",
                    oneOf: ["allow", "ignore"]
                },
                {
                    key: "role",
                    prompt: "What role do you want to do?",
                    type: "role"
                }
            ]
        })
    }

    async run(message, { action, role }) {
        const VoiceSettings = this.client.provider.getGuild(message.guild.id, "voice");
        const VoiceLog = VoiceSettings.log;
        //get the channel instance from the Member
        const { channel } = message.member.voice;
        //if role not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command");
        const VoiceSearch = await this.client.provider.getVCCollection().findOne({ channelID: channel.id });
        if (!VoiceSearch) return message.reply("this is not a custom voice channel");
        if (message.author.id !== VoiceSearch.owner || !message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only owner of this voice can run this command");
        switch (action) {
            case "allow":
                if (VoiceSearch.role.allowed.includes(role.id)) {
                    channel.updateOverwrite(role.id, {
                        CONNECT: null
                    }).then(newChannel => {
                        this.client.provider.getVCCollection().updateOne(
                            {
                                channelID: channel.id
                            },
                            {
                                $pull: {
                                    "role.allowed": role.id
                                }
                            }
                        ).then(val => {
                            message.reply(`${role.name} is no longer allowed to join this channel`);
                            VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                                embed: new MessageEmbed()
                                    .setAuthor(`${message.author.username}`)
                                    .setTitle("Custom voice channel updated")
                                    .setDescription(`Voice channel \`${channel.name}\` disallowed \`${role.name}\` to join this channel.`)
                                    .setColor("YELLOW")
                                    .setTimestamp()
                            })
                        })
                    })

                } else {
                    channel.updateOverwrite(role.id, {
                        CONNECT: true
                    }).then(newChannel => {
                        this.client.provider.getVCCollection().updateOne(
                            {
                                channelID: channel.id
                            },
                            {
                                $push: {
                                    "role.allowed": role.id
                                }
                            }
                        ).then(val => {
                            message.reply(`${role.name} is allowed to join this channel`);
                            VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                                embed: new MessageEmbed()
                                    .setAuthor(`${message.author.username}`)
                                    .setTitle("Custom voice channel updated")
                                    .setDescription(`Voice channel \`${channel.name}\` allowed \`${role.name}\` to join this channel.`)
                                    .setColor("YELLOW")
                                    .setTimestamp()
                            })
                        })
                    })
                }
                break;
            case "ignore":
                if (VoiceSearch.role.ignored.includes(role.id)) {
                    channel.updateOverwrite(role.id, {
                        CONNECT: null
                    }).then(newChannel => {
                        this.client.provider.getVCCollection().updateOne(
                            {
                                channelID: channel.id
                            },
                            {
                                $pull: {
                                    "role.ignored": role.id
                                }
                            }
                        ).then(val => {
                            message.reply(`Remove \`${role.name}\` from ignored list successful`);
                            VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                                embed: new MessageEmbed()
                                    .setAuthor(`${message.author.username}`)
                                    .setTitle("Custom voice channel updated")
                                    .setDescription(`Voice channel \`${channel.name}\`owner removed \`${role.name}\` from ignored list `)
                                    .setColor("YELLOW")
                                    .setTimestamp()
                            })
                        })
                    })

                } else {
                    channel.updateOverwrite(role.id, {
                        CONNECT: false
                    }).then(newChannel => {
                        this.client.provider.getVCCollection().updateOne(
                            {
                                channelID: channel.id
                            },
                            {
                                $push: {
                                    "role.ignored": role.id
                                }
                            }
                        ).then(val => {
                            message.reply(`Added \`${role.name}\` to ignored list successful`);
                            VoiceLog && message.guild.channels.cache.get(VoiceLog).send({
                                embed: new MessageEmbed()
                                    .setAuthor(`${message.author.username}`)
                                    .setTitle("Custom voice channel updated")
                                    .setDescription(`Voice channel \`${channel.name}\`owner added \`${role.name}\` from ignored list `)
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
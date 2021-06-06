const { MessageEmbed } = require("discord.js");
const { stripIndent } = require("common-tags")
const Command = require("../../structures/Command");

module.exports = class MChannelCMD extends Command {
    constructor(client) {
        super(client, {
            name: "mchannel",
            memberName: "mchannel",
            group: "admin",
            description: "Create new master channels or change their default settings.",
            userPermissions: ["ADMINISTRATOR"],
            clientPermissions: ["MANAGE_CHANNEL"],
            args: [
                {
                    key: "action",
                    prompt: "Give me a ID or action for me",
                    type: "string"
                },
                {
                    key: "property",
                    prompt: "What do you want to set?",
                    type: "string",
                    default: ""
                },
                {
                    key: "value",
                    prompt: "Give a value to setup property's value",
                    type: "string",
                    default: ""
                }
            ]
        })
    }

    async run(message, { action, property, value }) {
        const prefix = message.guild.commandPrefix ? message.guild.commandPrefix : this.client.commandPrefix;
        let VoiceSettings = this.client.provider.getGuild(message.guild.id, "voice");
        if (!VoiceSettings.status) return message.say(`Auto voice system currently disabled. Please use \`${prefix}vcsetup toggle\``);
        const totalChannel = this.client.provider.getVCCollection().find(
            { guildID: message.guild.id },
        ).toArray();
        if (action === "create") {
            let category = null, voicechannel;
            const master = this.client.provider.getVCCollection().find({
                $and: [
                    { guildID: message.guild.id },
                    { type: "master" }
                ]
            }).toArray();
            const masterlength = master.length > 0 ? master.length + 1 : 1;
            if (totalChannel >= VoiceSettings.limit || message.guild.channels.cache.size > 250) return message.reply("Limit exceeded");
            if (message.channel.parentID) {
                category = message.channel.parentID
            }
            try {
                if (category) {
                    voicechannel = await message.guild.channels.create(`Create voice ${masterlength}`, {
                        type: "voice",
                        bitrate: 64000,
                        userLimit: 0,
                        parent: category,
                        reason: "Create auto channel"
                    })
                } else {
                    voicechannel = await message.guild.channels.create(`Create voice ${masterlength}`, {
                        type: "voice",
                        bitrate: 64000,
                        userLimit: 0,
                        reason: "Create auto channel"
                    })
                }
                let id = this.client.util.createVoiceID();
                await this.client.provider.getVCCollection().insertOne(
                    {
                        channelID: voicechannel.id,
                        guildID: message.guild.id,
                        id,
                        type: "master",
                        vname: voicechannel.name,
                        name: "%USER%'s Home",
                        userLimit: 0,
                        bitrate: 64000,
                        category: category ? category : "None",
                        copyperm: false,
                        pushtotalk: false,
                        isLock: false
                    }
                )
                return message.say(`Create master channel with id \`${id}\` successfully`);
            } catch (err) {
                throw err;
            }

        } else if (action === "show") {
            const masterList = await this.client.provider.getVCCollection().find({
                $and: [
                    { guildID: message.guild.id },
                    { type: "master" }
                ]
            }).toArray();
            let masterDisplay = masterList.length ? masterList.map((val, i) => `${i++}. ${val.vname} (${val.id})`).join("\n") : "None";
            return message.channel.send({
                embed: new MessageEmbed()
                    .setTitle("Master channel list")
                    .setDescription(`\`\`\`${masterDisplay}\n\`\`\``)
                    .setColor("RED")
                    .setTimestamp()
            })
        } else if (action === "set") {
            const { channel } = message.member.voice;
            if (!channel) return message.reply("you must in a spefic voice to run this command");
            let setid = this.client.util.createVoiceID();
            const findChannel = await this.client.provider.getVCCollection().findOne({ channelID: channel.id });
            if (findChannel) return message.say(`This channel is already a ${findChannel.type}`);
            await this.client.provider.getVCCollection().insertOne(
                {
                    channelID: channel.id,
                    guildID: message.guild.id,
                    id: setid,
                    type: "master",
                    vname: channel.name,
                    name: "%USER%'s Home",
                    userLimit: 0,
                    bitrate: channel.bitrate,
                    category: channel.parent ? channel.parent : "None",
                    copyperm: false,
                    pushtotalk: false,
                    isLock: false
                }
            )

        } else if (action === "help") {
            const embed = new MessageEmbed()
                .setTitle("Master Channel Help")
                .setDescription(stripIndent`
                    ${prefix}mchannel create: Create a new master channel.
                    ${prefix}mchannel show: Show all master channel in current guild.
                    ${prefix}mchannel help: Show this embed.
                    ${prefix}mcahnnel ID property value: Change setting of master channel. (ID can found at ${prefix}mchannel show).
                    
                    **You must enable voice system to run above sub command**`)
                .setColor("GREEN")
                .setTimestamp();
            return message.channel.send({ embed });
        } else {
            const findMaster = await this.client.provider.getVCCollection().findOne({
                id: action
            });
            if (!findMaster) return message.reply("invalid ID. Try again");
            switch (property) {
                case "setting":
                case "settings":
                    const settingEmbed = new MessageEmbed()
                        .setAuthor(`${message.author.username}#${message.author.discriminator}`)
                        .setTitle(`${findMaster.name}`)
                        .setDescription(stripIndent`
                            ID: ${findMaster.id}
                            Default name: \`${findMaster.name}\`
                            UserLimit: ${findMaster.userLimit}
                            Bitrate: ${findMaster.bitrate}
                            Category: ${findMaster.category}
                            Copyperm: ${findMaster.copyperm ? "Yes" : "No"}
                            Pushtotalk: ${findMaster.pushtotalk ? "Yes" : "No"}
                        `)
                        .setColor("RANDOM")
                        .setTimestamp();
                    message.embed(settingEmbed);
                    break;
                case "name":
                    if (!value) return message.reply("please input any value");
                    if (value === findMaster.name) return message.reply("nothing change");
                    let valName = value;
                    if (value === "default" || value === "reset") {
                        valName = "%USER%'s Home";
                    }
                    this.client.provider.getVCCollection().updateOne(
                        {
                            id: action
                        },
                        {
                            $set: { name: valName }
                        }
                    ).then(val => {
                        return message.say("Update name successful");
                    }).catch(err => {
                        console.error(err);
                        message.reply("error while update channel name of amster channel");
                    })
                    break;
                case "limit":
                case "userlimit":
                    if (!value) return message.reply("please input any value");
                    const limitNum = parseInt(value);
                    if (!isNaN(limitNum)) return message.reply("wrong input type");
                    if (limitNum < 0 || limitNum > 99) return message.reply("you can set user limit between 0 and 99");
                    if (limitNum === findMaster.userLimit) return message.reply("nothing change");
                    this.client.provider.getVCCollection().updateOne(
                        {
                            id: action
                        },
                        {
                            $set: { userLimit: limitNum }
                        }
                    ).then(val => {
                        return message.say("Update user limit successful");
                    }).catch(err => {
                        console.error(err);
                        message.reply("error while update user limit of master channel");
                    })
                    break;
                case "copyperm":
                    if (!value) return message.reply("please input any value");
                    if (["true", "false"].includes(value)) return message.reply(`Only accept \`true\` or \`false\``);
                    this.client.provider.getVCCollection().updateOne(
                        {
                            id: action
                        },
                        {
                            $set: { copyperm: Boolean(value) }
                        }
                    ).then(val => {
                        return message.say(`${Boolean(value) ? "Enabled" : "Disabled"} copyperm successful`);
                    }).catch(err => {
                        console.error(err);
                        message.reply("error while update copyperm of master channel");
                    })
                    break;
                case "pushtotalk":
                case "ptt":
                    if (!value) return message.reply("please input any value");
                    if (["true", "false"].includes(value)) return message.reply(`Only accept \`true\` or \`false\``);
                    this.client.provider.getVCCollection().updateOne(
                        {
                            id: action
                        },
                        {
                            $set: { pushtotalk: Boolean(value) }
                        }
                    ).then(val => {
                        return message.say(`${Boolean(value) ? "Enabled" : "Disabled"} pushtotalk successful`);
                    }).catch(err => {
                        console.error(err);
                        message.reply("error while update pushtotalk of master channel");
                    })
                    break;
                case "bitrate":
                    if (!value) return message.reply("please input any value");
                    const bitrateNum = parseInt(value);
                    if (!isNaN(bitrateNum)) return message.reply("wrong input type");
                    if (bitrateNum < 8 || bitrateNum > 96) return message.reply("you can set user limit between 8 and 96");
                    this.client.provider.getVCCollection().updateOne(
                        {
                            id: action
                        },
                        {
                            $set: { bitrate: bitrateNum * 1000 }
                        }
                    ).then(val => {
                        return message.say("Update birate of master channel successful");
                    }).catch(err => {
                        console.error(err);
                        message.reply("error while update bitrate of master channel");
                    })
                    break;
                default:
                    message.channel.send({
                        embed: new MessageEmbed()
                            .setTitle(`Master Channel Setting Help`)
                            .setDescription(stripIndent`
                                ${prefix}mcahnnel ID name name: Change default name
                                ${prefix}mcahnnel ID limit/userlimit number: Change user limit of channel
                                ${prefix}mcahnnel ID copyperm: Toggle copy permission from master channel
                                ${prefix}mcahnnel ID pushtotalk/ptt: Toggle pushtotalk for master channel
                                ${prefix}mcahnnel ID bitrate number: change bitrate of master channel
                            `)
                            .setColor("GREEN")
                            .setTimestamp()
                    })
                    break;
            }
        }
    }
}
const { MessageEmbed } = require("discord.js");

module.exports = async (client, newState) => {
    const VoiceSettings = client.provider.getGuild(newState.guild.id, "voice");
    const VoiceLog = VoiceSettings.log;
    const user = await client.users.fetch(newState.id);
    const member = newState.member;
    const JoinedChannelID = newState.channel.id;
    const VoiceSearch = await client.provider.getVCCollection().findOne({ channelID: JoinedChannelID });
    if (!VoiceSearch) return; // if joined channel is not a master channel or custom channel created by bot, exit

    if (VoiceSearch.type === "master") {
        if (VoiceSearch.copyperm) {
            const CopyChannel = await newState.channel.clone({
                name: VoiceSearch.name.replace("%USER%", user.username),
                type: "voice"
            })
            await newState.setChannel(CopyChannel);
            await CopyChannel.updateOverwrite(user.id, 
                {
                    CONNECT: true,
                    VIEW_CHANNEL: true
                }
            );
            if (VoiceSearch.pushtotalk) await CopyChannel.updateOverwrite(newState.guild.id, { USE_VAD: false });
            client.provider.getVCCollection().insertOne({
                channelID: CopyChannel.id,
                guildID: newState.guild.id,
                id: CopyChannel.id,
                type: "custom",
                vname: CopyChannel.name,
                name: CopyChannel.name,
                userLimit: CopyChannel.userLimit,
                bitrate: CopyChannel.bitrate,
                pushtotalk: false,
                owner: user.id,
                isLock: false,
                user: {
                    allowed: [],
                    ignored: [],
                },
                role: {
                    allowed: [],
                    ignored: []
                }
            }).then(val => {
                VoiceLog && newState.guild.channels.cache.get(VoiceLog).send({
                    embed: new MessageEmbed()
                        .setAuthor(`${user.username}`)
                        .setTitle("New auto channel created")
                        .setDescription(`<@${user.id}> create a new custom voice channel with name \`${CopyChannel.name}\``)
                        .setColor("GREEN")
                        .setTimestamp()
                })
            })
        } else {
            const NewChannel = await newState.guild.channels.create(VoiceSearch.name.replace("%USER%", user.username), {
                type: "voice",
                parent: VoiceSearch.category,
                bitrate: VoiceSearch.bitrate,
                userLimit: VoiceSearch.userLimit
            })

            await newState.setChannel(NewChannel);
            await NewChannel.updateOverwrite(newState.id, 
                {
                    CONNECT: true,
                    VIEW_CHANNEL: true
                }
            );
            if (VoiceSearch.pushtotalk) await NewChannel.updateOverwrite(newState.guild.id, { USE_VAD: false });
            client.provider.getVCCollection().insertOne({
                channelID: NewChannel.id,
                guildID: newState.guild.id,
                id: NewChannel.id,
                type: "custom",
                vname: NewChannel.name,
                name: NewChannel.name,
                userLimit: NewChannel.userLimit,
                bitrate: NewChannel.bitrate,
                pushtotalk: false,
                owner: user.id,
                isLock: false,
                user: {
                    allowed: [],
                    ignored: [],
                },
                role: {
                    allowed: [],
                    ignored: []
                }
            }).then(val => {
                VoiceLog && newState.guild.channels.cache.get(VoiceLog).send({
                    embed: new MessageEmbed()
                        .setAuthor(`${user.username}`)
                        .setTitle("New auto channel created")
                        .setDescription(`<@${user.id}> create a new custom voice channel with name \`${val.name}\``)
                        .setColor("GREEN")
                        .setTimestamp()
                })
            })
        }

    } else if (VoiceSearch.type === "custom") {
        if (VoiceSearch.user.ignored.includes(user.id) || VoiceSearch.role.ignored.some(id => member.roles.cache.has(id))) return newState.setChannel(null);
        if (VoiceSearch.isLock && (!VoiceSearch.user.allowed.includes(user.id) || !VoiceSearch.role.allowed.some(id => member.roles.cache.has(id)))) return newState.setChannel(null);
    }
}
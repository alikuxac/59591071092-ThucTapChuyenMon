const { MessageEmbed } = require("discord.js");

module.exports = async (client, newState) => {
    const VoiceSettings = client.provider.getGuild(newState.guild.id, "voice");
    const VoiceLog = VoiceSettings.log;
    const user = client.users.fetch(newState.id);
    const member = newState.guild.member(user);
    const JoinedChannelID = newState.channel.id;
    const VoiceSearch = client.provider.getVCCollection().findOne({ channelID: JoinedChannelID });
    if (!VoiceSearch) return; // if joined channel is not a master channel or custom channel created by bot, exit

    if (VoiceSearch.type === "master") {
        if (VoiceSearch.copyperm) {
            const CopyChannel = await newState.channel.clone({
                name: VoiceSearch.name.replace("%USER%", user.username),
                type: "voice"
            })
            member.voice.setChannel(CopyChannel);
            CopyChannel.overwritePermissions([
                {
                    id: user.id,
                    allow: ["CONNECT", "VIEW_CHANNEL"]
                }
            ]);
            if (VoiceSearch.pushtotalk) CopyChannel.overwritePermissions([{ id: newState.guild.id, allow: ["USE_VAD"] }]);
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
                        .setDescription(`<#${user.id}> create a new custom voice channel with name \`${CopyChannel.name}\``)
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

            member.voice.setChannel(NewChannel);
            NewChannel.overwritePermissions([
                {
                    id: user.id,
                    allow: ["CONNECT", "VIEW_CHANNEL"]
                }
            ]);
            if (VoiceSearch.pushtotalk) NewChannel.overwritePermissions([{ id: newState.guild.id, deny: ["USE_VAD"] }]);
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
                        .setDescription(`<#${user.id}> create a new custom voice channel with name \`${NewChannel.name}\``)
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
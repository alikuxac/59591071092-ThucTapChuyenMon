const { MessageEmbed } = require("discord.js");

module.exports = async (client, oldState, newState) => {
    const VoiceSettings = client.provider.getGuild(newState.guild.id, "voice");
    const VoiceLog = VoiceSettings.log;
    const user = await client.users.fetch(oldState.id);
    const member = newState.member;
    const LeftChannelID = oldState.channel.id;
    const VoiceSearchLeft = await client.provider.getVCCollection().findOne({ channelID: LeftChannelID });
    const JoinedChannelID = newState.channel.id;
    const VoiceSearchJoin = await client.provider.getVCCollection().findOne({ channelID: JoinedChannelID });

    // If no one left in the custom voice channel, delete it
    if (VoiceSearchLeft && VoiceSearchLeft.type === "custom" && oldState.channel.members.size == 0) {
        await oldState.channel.delete().catch();
        client.provider.getVCCollection().deleteOne({ channelID: LeftChannelID })
            .then(val => {
                VoiceLog && oldState.guild.channels.cache.get(VoiceLog).send({
                    embed: new MessageEmbed()
                        .setAuthor(`${user.username}`)
                        .setTitle("Custom voice channel deleted")
                        .setDescription(`Voice channel (${oldState.channel.name}) deleted`)
                        .setColor("RED")
                        .setTimestamp()
                })
            });
    }
    if (VoiceSearchJoin && VoiceSearchJoin.type === "master") {
        if (VoiceSearchJoin.copyperm) {
            const CopyChannel = await newState.channel.clone({
                name: VoiceSearchJoin.name.replace("%USER%", user.username),
                type: "voice"
            })
            await newState.setChannel(CopyChannel);
            await CopyChannel.updateOverwrite(user.id,
                {
                    CONNECT: true,
                    VIEW_CHANNEL: true
                }
            );
            if (VoiceSearchJoin.pushtotalk) await CopyChannel.updateOverwrite(newState.guild.id, { USE_VAD: false });
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
                userban: [],
                roleban: []
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
            const NewChannel = await newState.guild.channels.create(VoiceSearchJoin.name.replace("%USER%", user.username), {
                type: "voice",
                parent: VoiceSearchJoin.category,
                bitrate: VoiceSearchJoin.bitrate,
                userLimit: VoiceSearchJoin.userLimit
            })

            await newState.setChannel(NewChannel);
            await NewChannel.updateOverwrite(newState.id,
                {
                    CONNECT: true,
                    VIEW_CHANNEL: true
                }
            );
            if (VoiceSearchJoin.pushtotalk) await NewChannel.updateOverwrite(newState.guild.id, { USE_VAD: false });
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
                userban: [],
                roleban: []
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

    } else if (VoiceSearchJoin && VoiceSearchJoin.type === "custom") {
        // If user in blacklist of channel
        if (VoiceSearchJoin.user.ignored.includes(user.id) || VoiceSearchJoin.role.ignored.some(id => member.roles.cache.has(id))) return newState.setChannel(null);
        // If channel is locked and user not in allowed
        if (VoiceSearchJoin.isLock && (!VoiceSearchJoin.user.allowed.includes(user.id) || !VoiceSearchJoin.role.allowed.some(id => member.roles.cache.has(id)))) return newState.setChannel(null);
    }
}
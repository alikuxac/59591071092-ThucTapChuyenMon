const Command = require('../../structures/Command');

module.exports = class PlayCMD extends Command {
    constructor(client) {
        super(client, {
            name: 'playsc',
            memberName: 'playsc',
            group: 'music',
            description: 'Play a song in Soundcloud',
            userPermissions: ['SEND_MESSAGES'],
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            args: [
                {
                    key: 'song',
                    prompt: 'You need to give me a URL or a search term.',
                    type: 'string'
                }
            ]
        })
    }

    async run(message, args) {
        //get the channel instance from the Member
        const { channel } = message.member.voice;
        //if user not in a voice channel
        if (!channel) return message.reply("you must in a voice channel to run command").then(msg => {
            try { msg.delete({ timeout: 5000 }).catch(e => this.client.logger.log("Couldn't delete message this is a catch to prevent a crash")); } catch { /* */ }
        });
        //get the player instance
        const player = this.client.manager.players.get(message.guild.id);
        //f not in the same channel --> return
        if (player && message.member.voice.channel.id !== player.voiceChannel)
            return message.channel.send(`You need to be in my voice channel to use this command!`).then(async msg => await msg.delete({ timeout: 5000 }).catch());

        // Create the player 
        const newplayer = this.client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
        });
        const search = args.song;
        let res;
        let type = 'soundcloud';

        if (/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/.test(search)) return message.channel.send(`This command only support song from Soundcloud. Use ${this.client.commandPrefix}play`);

        try {
            // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
            res = await this.client.manager.search({ query: search, source: type }, message.author);
            // Check the load type as this command is not that advanced for basics
        } catch (err) {
            return message.reply(`There was an error while searching: ${err.message}`);
        }

        switch (res.loadType) {
            case 'LOAD_FAILED':
                return message.channel.send(res.exception.message).then(msg => {
                    try {
                        msg.delete({ timeout: 4000 }).catch(e => this.client.logger.log("couldn't delete message this is a catch to prevent a crash"));
                    } catch { /* */ }
                });
            case "NO_MATCHES":
                return message.channel.send("There was no tracks found with that query.").then(async msg => await msg.delete({ timeout: 5000 }).catch());
            case "TRACK_LOADED":
                newplayer.queue.add(res.tracks[0]);
                message.channel.send(`Enqueuing ${res.tracks[0].title}.`).then(async msg => await msg.delete({ timeout: 5000 }).catch());

                if (newplayer.state !== "CONNECTED") {
                    newplayer.connect();
                    newplayer.set("playerauthor", message.author.id);
                    newplayer.play();
                    if (this.client.manager.util.ismanangerchannel(this.client, newplayer.textChannel)) this.client.manager.util.edit_manager_message_playing(this.client, newplayer);
                } else {
                    if (!newplayer.playing) {
                        newplayer.play();
                    } else if (this.client.manager.util.ismanangerchannel(this.client, newplayer.textChannel) && newplayer.playing) {
                        this.client.manager.util.add_song_to_queue(this.client, newplayer);
                    }
                }
                break;
            case 'PLAYLIST_LOADED':
                newplayer.queue.add(res.tracks);
                message.channel.send(`Enqueuing ${res.playlist.name}.`).then(async msg => await msg.delete({ timeout: 5000 }).catch());

                if (newplayer.state !== "CONNECTED") {
                    newplayer.connect();
                    newplayer.set("playerauthor", message.author.id);
                    newplayer.play();
                    if (this.client.manager.util.ismanangerchannel(this.client, newplayer.textChannel)) this.client.manager.util.edit_manager_message_playing(this.client, newplayer);
                } else {
                    if (!newplayer.playing) {
                        newplayer.play();
                    } else if (this.client.manager.util.ismanangerchannel(this.client, newplayer.textChannel) && newplayer.playing) {
                        this.client.manager.util.add_song_to_queue(this.client, newplayer);
                    }
                }
                break;
            case 'SEARCH_RESULT':
                let max = 10;
                let filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
                if (res.tracks.length < max) max = res.tracks.length;
                const results = res.tracks
                    .slice(0, max)
                    .map((track, index) => `${++index} - \`${track.title}\``)
                    .join("\n");
                const resultsEmbed = new MessageEmbed()
                    .setTitle("Select a song to play and send the number next to it. You have 30 seconds to select.")
                    .setDescription(results)
                    .setColor("RANDOM")
                    .setFooter(`Use "end" to cancel`);
                let resultMsg = await message.channel.send(resultsEmbed);

                let collected = await message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30e3,
                    errors: ["time"],
                });
                const first = collected.first().content;
                if (first.toLowerCase() === "end") {
                    await resultMsg.delete().catch();
                    return message.channel.send(":white_check_mark: | Cancelled selection.").then(async msg => await msg.delete({ timeout: 5000 }).catch());
                }

                const index = Number(first) - 1;
                if (index < 0 || index > max - 1) {
                    await resultMsg.delete().catch();
                    return message.channel.send(
                        `:x: | The number you provided is too small or too big (1-${max}).`
                    );

                }

                const track = res.tracks[index];
                newplayer.queue.add(track);
                await resultMsg.delete().catch();
                message.channel.send(`:white_check_mark: | **Enqueuing:** \`${track.title}\`.`).then(async msg => await msg.delete({ timeout: 5000 }).catch());

                if (newplayer.state !== "CONNECTED") {
                    newplayer.connect();
                    newplayer.set("playerauthor", message.author.id);
                    newplayer.play();
                    if (this.client.manager.util.ismanangerchannel(this.client, newplayer.textChannel)) this.client.manager.util.edit_manager_message_playing(this.client, newplayer);
                } else {
                    if (this.client.manager.util.ismanangerchannel(this.client, newplayer.textChannel)) this.client.manager.util.add_song_to_queue(this.client, newplayer);
                }
                break;
            default:
                break;
        }

        if (newplayer.state !== "CONNECTED") {
            newplayer.connect();
            newplayer.set("playerauthor", message.author.id);
            newplayer.play();
            if (ismanangerchannel(this.client, message.channel.id)) this.client.manager.util.edit_manager_message_playing(this.client, newplayer);
        } else {
            if (!newplayer.playing) {
                newplayer.play();
            } else if (this.client.manager.util.ismanangerchannel(this.client, newplayer.textChannel) && newplayer.playing) {
                this.client.manager.util.add_song_to_queue(this.client, newplayer);
            }
        }

    }
}
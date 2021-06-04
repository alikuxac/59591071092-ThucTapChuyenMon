const Discord = require("discord.js");
const { CommandoClient } = require("discord.js-commando");
const winston = require("winston");
const fs = require("fs");
const path = require("path");
const Player = require("./Player");
const Database = require("./Database");
const { Utils, DateUtils } = require("./Util");
const { TOKEN } = process.env;

const nodes = [
    {
        host: process.env.LAVALINK_HOST,
        password: process.env.LAVALINK_PASS,
        port: parseInt(process.env.LAVALINK_PORT)
    }
]

module.exports = class ExtendedClient extends CommandoClient {

    constructor(options = {}) {
        super(options);

        /**
         * Winston logger
         * @type Logger
         */
        this.logger = winston.createLogger({
            transports: [new winston.transports.Console()],
            format: winston.format.combine(
                winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
                winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`)
            )
        });
        this.managerOptions = {
            nodes,
            send: (id, payload) => {
                const guild = this.guilds.cache.get(id);
                // NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
                if (guild) guild.shard.send(payload);
            },
            autoPlay: true
        }

        /**
         * Music Manager
         * @type {Player}
         */
        this.manager = new Player(this.managerOptions, this);

        /**
         * Store all events in events folder
         * @type {?Discord.Collection}
         */
        this.events = new Discord.Collection();

        /**
         * @type {Class}
         */
        this.util = new Utils();

        /**
         * @type {Class}
         */
        this.dateutil = new DateUtils();

    }

    build() {
        this.on("warn", (e) => this.logger.warn(e));
        this.on("error", (...x) => this.logger.error("[CLIENT ERROR]", ...x));
        this.ws.on("close", (...x) => this.logger.log("[WS CLOSE]", ...x));
        this.setProvider(new Database());
        this.loadEvents();
        this.loadManagerEvents();
        this.registry
            .registerDefaultTypes()
            .registerDefaultGroups()
            .registerDefaultCommands({
                help: true,
                prefix: true,
                eval: true,
                ping: true,
                commandState: true,
                unknownCommand: false,
            })
            .registerGroups(require(path.join(__dirname, "..", "config", "command_group")))
            .registerCommandsIn(path.join(__dirname, "..", "commands"));
        this.login(TOKEN);
    }

    /**
     * @name loadEvents
     * @description Load event in events folder
     * @private
     */
    loadEvents() {
        fs.readdir("./events", (err, files) => {
            if (err) return this.logger.error(err);
            files.forEach(file => {
                if (!file.endsWith(".js")) return;
                const event = require(`../events/${file}`);
                let eventName = file.split(".")[0];
                this.on(eventName, event.bind(null, this));
                this.events.set(eventName, event);
                delete require.cache[require.resolve(`../events/${file}`)];
            })
        });
    }

    /**
     * Load manager event
     * @private 
     */
    async loadManagerEvents() {
        this.on("ready", () => this.manager.init(this.user.id));
        this.on("raw", d => this.manager.updateVoiceState(d));

        // Emitted whenever a node connects
        this.manager.on("nodeConnect", node => {
            console.log(`Node "${node.options.identifier}" connected.`)
        })

        // Emitted whenever a node reconnects
        this.manager.on("nodeReconnect", node => {
            console.log(`Node "${node.options.identifier}" reconnecting.`)
        })

        // Emitted whenever a node disconnects
        this.manager.on("nodeDisconnect", node => {
            console.log(`Node "${node.options.identifier}" disconnected.`)
        })

        // Emitted whenever a node encountered an error
        this.manager.on("nodeError", (node, error) => {
            console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
        })

        this.manager.on("playerCreate", async (player) => {
            setTimeout(async () => {
                player.setVolume(100);
                player.set("autoplay", false);
                player.set("24/7", false);
            }, 100);
        })

        this.manager.on("playerMove", (player, oldChannel, newChannel) => {
            if (!newChannel) {
                const playchannel = this.channels.cache.get(player.textChannel);
                playchannel.send(`Queue has ended. I left the channel`)
                    .then(msg => {
                        try {
                            msg.delete({ timeout: 7500 }).catch(e => console.log("couldn't delete ended message this is a catch to prevent a crash"));
                        } catch { /* */ }
                    });
                try {
                    if (player.get("msgid"))
                        this.channels.cache.get(player.textChannel).messages.fetch(player.get("msgid"))
                            .then(msg => {
                                try {
                                    msg.delete({ timeout: 2500 }).catch(e => console.log("couldn't delete last message this is a catch to prevent a crash"));
                                } catch { /* */ }
                            });
                } catch (err) {
                    console.log(err.stack);
                }
                player.destroy();
            } else {
                player.voiceChannel = newChannel;
                if (player.paused) return;
                setTimeout(() => {
                    player.pause(true);
                    setTimeout(() => player.pause(false), this.ws.ping * 2);
                }, this.ws.ping * 2);
            }
        })

        this.manager.on("trackStart", async (player, track) => {

            // console.log(trackmsg);
            player.set("votes", 0)
            for (const userid of this.guilds.cache.get(player.guild).members.cache.map(member => member.user.id))
                player.set(`vote-${userid}`, false);
            player.set("previoustrack", track);
            // Wait 500ms
            await this.util.delay(500);

            const channel = await this.channels.fetch(player.textChannel);
            let embed = new Discord.MessageEmbed()
                .setTitle(`Music Player`)
                .setDescription(`Playing: ${track.title}`)
                .setThumbnail(track.displayThumbnail(1))
                .setColor(`#ff0000`)
                .addField("❯ Duration: ", `\`${track.isStream ? "LIVE STREAM" : this.util.msToHHMMSS(track.duration)}\``, true)
                .addField("❯ Song By: ", `\`${track.author}\``, true)
                .addField("❯ Queue length: ", `\`${player.queue.length} Songs\``, true)
                .setFooter(`Requested by: ${track.requester.tag}`, track.requester.displayAvatarURL({ dynamic: true }));


            // Send a message when not in manager music channel and the track starts playing with the track name 
            if (player.get("msgid")) {
                let oldMsg = await channel.messages.cache.get(player.get("msgid"))
                await this.util.delay(500);
                await oldMsg.delete().catch();
            }
            let sentMsg = await channel.send({ embed: embed })
            player.set("msgid", sentMsg.id)
        });

        this.manager.on("trackError", (player, track, payload) => {
            player.stop();
            this.channels.cache.get(player.textChannel)
                .send(`I skipped the track **${track.title}** because of error`)
                .then(msg => {
                    try {
                        msg.delete({ timeout: 2500 }).catch(e => console.log("couldn't delete track error message this is a catch to prevent a crash"));
                    } catch { /* */ }
                });
        })

        // Emitted the player queue ends
        this.manager.on("queueEnd", async (player) => {

            if (player.get("autoplay")) return this.manager.util.autoplay(this, player);
            const noSongEmbed = new Discord.MessageEmbed()
                .setTitle(`Music Player!`)
                .setDescription(`No playing song currently!\nJoin a voice channel and enter a song name or url to play.`)
                .setColor("#ff0000")
                .setFooter(`Requested by: None`)

            const channel = this.channels.cache.get(player.textChannel);
            if (player.get("msgid")) {
                let oldMsg = await channel.messages.cache.get(player.get("msgid"))
                await this.util.delay(500);
                await oldMsg.delete().catch();
            }
            channel.send({ embed: noSongEmbed })
            player.stop();
        });
    }
}
const Command = require("../../structures/Command");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = class NMPCMD extends Command {
	constructor(client) {
		super(client, {
			name: "npm",
			group: "other",
			memberName: "npm",
			description: "Responds with information on an NPM package.",
			clientPermissions: ["EMBED_LINKS"],
			args: [
				{
					key: "pkg",
					label: "package",
					prompt: "What package would you like to get information on?",
					type: "string",
					parse: pkg => encodeURIComponent(pkg.replace(new RegExp(" ", "g"), "-"))
				}
			]
		});
	}

	async run(message, { pkg }) {
		try {
			const { data } = await axios.get(`https://registry.npmjs.com/${pkg}`);
			if (data.time.unpublished) return message.say("This package no longer exists.");
			const version = data.versions[data["dist-tags"].latest];
			const maintainers = this.client.util.trimArray(data.maintainers.map(user => user.name));
			const dependencies = version.dependencies ? this.client.util.trimArray(Object.keys(version.dependencies)) : null;
			const embed = new MessageEmbed()
				.setColor(0xCB0000)
				.setAuthor("NPM", "https://i.imgur.com/ErKf5Y0.png", "https://www.npmjs.com/")
				.setTitle(data.name)
				.setURL(`https://www.npmjs.com/package/${pkg}`)
				.setDescription(data.description || "No description.")
				.addField("❯ Version", data["dist-tags"].latest, true)
				.addField("❯ License", data.license || "None", true)
				.addField("❯ Author", data.author ? data.author.name : "???", true)
				.addField("❯ Creation Date", moment.utc(data.time.created).format("MM/DD/YYYY h:mm A"), true)
				.addField("❯ Modification Date", moment.utc(data.time.modified).format("MM/DD/YYYY h:mm A"), true)
				.addField("❯ Main File", version.main || "index.js", true)
				.addField("❯ Dependencies", dependencies && dependencies.length ? dependencies.join(", ") : "None")
				.addField("❯ Maintainers", maintainers.join(", "));
			return message.embed(embed);
		} catch (err) {
			if (err.status === 404) return message.say("Could not find any results.");
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}

	}
};

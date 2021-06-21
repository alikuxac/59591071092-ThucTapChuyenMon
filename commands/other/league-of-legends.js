const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const buttons = ["Q", "W", "E", "R"];

module.exports = class LeagueOfLegendsCMD extends Command {
	constructor(client) {
		super(client, {
			name: "league-of-legends",
			aliases: ["league-of-legends-champion", "league-of-legends-champ", "league-champ", "lol-champ"],
			group: "other",
			memberName: "league-of-legends",
			description: "Responds with information on a League of Legends champion.",
			clientPermissions: ["EMBED_LINKS"],
			args: [
				{
					key: "champion",
					prompt: "What champion would you like to get information on?",
					type: "string",
					parse: champion => champion.toLowerCase()
				},
				{
					key: "language",
					prompt: "What language do you want to show?",
					type: "string",
					default: "en_US"
				}
			]
		});

		this.version = null;
		this.champions = null;
		this.languages = ["en_US", "cs_CZ", "de_DE", "el_GR", "en_AU", "en_GB", "en_PH", "en_SG", "es_AR", "es_ES", "es_MX", "fr_FR", "hu_HU", "id_ID", "it_IT", "ja_JP", "ko_KR", "pl_PL", "pt_BR", "ro_RO", "ru_RU", "th_TH", "tr_TR", "vn_VN", "zh_CN", "zh_MY", "zh_TW"];
	}

	async run(message, { champion, language }) {
		if (champion === "satan") champion = "teemo";
		try {
			if (!this.version) await this.fetchVersion();
			const findLang = this.languages.includes(language)
			if (!findLang) return message.say(`Invalid language. Available languages: ${this.languages.join(", ")}`);
			const data = await this.fetchChampion(champion, language);
			if (!data) return message.say("Could not find any results.");
			const tips = [].concat(data.allytips, data.enemytips);
			const embed = new MessageEmbed()
				.setColor(0x002366)
				.setAuthor("League of Legends", "https://i.imgur.com/2JL4Rko.png", "https://leagueoflegends.com/")
				.setTitle(`${data.name} ${data.title}`)
				.setDescription(data.blurb)
				.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/${data.image.full}`)
				.addField("❯ Attack", data.info.attack, true)
				.addField("❯ Defense", data.info.defense, true)
				.addField("❯ Magic", data.info.magic, true)
				.addField("❯ Difficulty", data.info.difficulty, true)
				.addField("❯ HP", `${data.stats.hp} (${data.stats.hpperlevel}/level)`, true)
				.addField("❯ HP Regen", `${data.stats.hpregen} (${data.stats.hpregenperlevel}/level)`, true)
				.addField("❯ MP", `${data.stats.mp} (${data.stats.mpperlevel}/level)`, true)
				.addField("❯ MP Regen", `${data.stats.mpregen} (${data.stats.mpregenperlevel}/level)`, true)
				.addField("❯ Resource", data.partype, true)
				.addField("❯ Armor", `${data.stats.armor} (${data.stats.armorperlevel}/level)`, true)
				.addField("❯ Attack Damage", `${data.stats.attackdamage} (${data.stats.attackdamageperlevel}/level)`, true)
				.addField("❯ Attack Range", data.stats.attackrange, true)
				.addField("❯ Attack Speed", `${data.stats.attackspeed} (${data.stats.attackspeedperlevel}/level)`, true)
				.addField("❯ Crit", `${data.stats.crit} (${data.stats.critperlevel}/level)`, true)
				.addField("❯ Move Speed", data.stats.movespeed, true)
				.addField("❯ Spell Block", `${data.stats.spellblock} (${data.stats.spellblockperlevel}/level)`, true)
				.addField("❯ Passive", data.passive.name, true)
				.addField("❯ Spells", data.spells.map((spell, i) => `${spell.name} (${buttons[i]})`).join("\n"), true);
			return message.say(`Tip: ${tips[Math.floor(Math.random() * tips.length)]}`, { embed });
		} catch (err) {
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchVersion() {
		const { data } = await axios.get("https://ddragon.leagueoflegends.com/api/versions.json");
		[this.version] = data;
		setTimeout(() => { this.version = null; }, 3.6e+6);
		return data;
	}

	async fetchChampions(language) {
		if (this.champions && this.champions.version === this.version) return this.champions;
		const { data } = await axios
			.get(`https://ddragon.leagueoflegends.com/cdn/${this.version}/data/${language}/champion.json`);
		this.champions = data;
		return data;
	}

	async fetchChampion(champion, language) {
		const champions = await this.fetchChampions(language);
		const name = Object.keys(champions.data).find(key => key.toLowerCase() === champion);
		if (!name) return null;
		const { id } = champions.data[name];
		const { data } = await axios
			.get(`https://ddragon.leagueoflegends.com/cdn/${this.version}/data/${language}/champion/${id}.json`);
		return data.data[id];
	}
};

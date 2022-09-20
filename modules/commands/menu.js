
/*
lỏ :<
*/

module.exports.config = {
	name: "menu",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Binee",
	description: "Menu",
	usages: "[all/-a] [pages]",
	commandCategory: "utilities",
	cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
	let num = parseInt(event.body.split(" ")[0].trim());
	(handleReply.bonus) ? num -= handleReply.bonus : num;
	let msg = "";
	let data = handleReply.content;
	let check = false;
	if (isNaN(num)) msg = "please choose";
	else if (num > data.length || num <= 0) msg = "o ";
	else {
		const { commands } = global.client;
		let dataAfter = data[num-=1];
		if (handleReply.type == "cmd_info") {
			let command_config = commands.get(dataAfter).config;
			msg += ` ╭──────╮\n   ${command_config.commandCategory.toUpperCase()}  \n╰──────╯   \n`;
			msg += `\n📘 Name: ${dataAfter}`;
			msg += `\n💊 Describe: ${command_config.description}`;
			msg += `\n🌀 Uses: ${(command_config.usages) ? command_config.usages : ""}`;
			msg += `\n⏱ Waiting time: ${command_config.cooldowns || 5}s`;
			msg += `\n🗝 Power: ${(command_config.hasPermssion == 0) ? "Người dùng" : (command_config.hasPermssion == 1) ? "Quản trị viên nhóm" : "Quản trị viên bot"}`;
      msg += `\n✎﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏`
			msg += `\n\n» Module code by ${command_config.credits} «`;
		} else {
			check = true;
			let count = 0;
			msg += `【    ${dataAfter.group.toUpperCase()}    】\n`;

			dataAfter.cmds.forEach(item => {
				msg += `\n 【${count+=1}】 ${item}: ${commands.get(item).config.description}🐉`;
			})
			msg += "\n\n╭──────╮\n    Reply \n╰──────╯ reply number";
		}
	}
	const axios = require('axios');
	const fs = require('fs-extra');
	const img = 
    [    "https://i.imgur.com/uBVzoLu.jpg",
    "https://i.imgur.com/2SKrp2u.jpg",
    "https://i.imgur.com/uBVzoLu.jpg",
    "https://i.imgur.com/2SKrp2u.jpg",
    "https://i.imgur.com/eQScoB2.jpg",
    "https://i.imgur.com/sPTDj7J.jpg",
    "https://i.imgur.com/eKO5bbW.jpg",
    "https://i.imgur.com/OPoAuZz.jpg",
    "https://i.imgur.com/e8Hs2LK.jpg",
    "https://i.imgur.com/JB9Ma7r.jpg",
    "https://i.imgur.com/skZasjw.jpg",
    "https://i.imgur.com/uzlkEbQ.jpg",
    "https://i.imgur.com/BlCpMpt.jpg"
    ]
	var path = __dirname + "/cache/help.png"
	var rdimg = img[Math.floor(Math.random() * img.length)]; 
	const imgP = []
	let dowloadIMG = (await axios.get(rdimg, { responseType: "arraybuffer" } )).data; 
	fs.writeFileSync(path, Buffer.from(dowloadIMG, "utf-8") );
	imgP.push(fs.createReadStream(path))
	var msgg = {body: msg, attachment: imgP}
	api.unsendMessage(handleReply.messageID);
	return api.sendMessage(msgg, event.threadID, (error, info) => {
		if (error) console.log(error);
		if (check) {
			global.client.handleReply.push({
				type: "cmd_info",
				name: this.config.name,
				messageID: info.messageID,
				content: data[num].cmds
			})
		}
	}, event.messageID);
}

module.exports.run = async function({ api, event, args }) {
	const { commands } = global.client;
	const { threadID, messageID } = event;
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
	const axios = require('axios');
	const fs = require('fs-extra');
	const imgP = []
	const img = [    "https://i.imgur.com/uBVzoLu.jpg",
    "https://i.imgur.com/2SKrp2u.jpg",
    "https://i.imgur.com/uBVzoLu.jpg",
    "https://i.imgur.com/2SKrp2u.jpg",
    "https://i.imgur.com/eQScoB2.jpg",
    "https://i.imgur.com/sPTDj7J.jpg",
    "https://i.imgur.com/eKO5bbW.jpg",
    "https://i.imgur.com/OPoAuZz.jpg",
    "https://i.imgur.com/e8Hs2LK.jpg",
    "https://i.imgur.com/JB9Ma7r.jpg",
    "https://i.imgur.com/skZasjw.jpg",
    "https://i.imgur.com/uzlkEbQ.jpg",
    "https://i.imgur.com/BlCpMpt.jpg"
    ]
	var path = __dirname + "/cache/help.png"
	var rdimg = img[Math.floor(Math.random() * img.length)]; 

   	let dowloadIMG = (await axios.get(rdimg, { responseType: "arraybuffer" } )).data; 
        fs.writeFileSync(path, Buffer.from(dowloadIMG, "utf-8") );
        imgP.push(fs.createReadStream(path))
	const command = commands.values();
	var group = [], msg = "╭──────╮\n         MENU \n╰──────╯\n     ◆━━━━━━━━━━◆";
	let check = true, page_num_input = "";
	let bonus = 0;

	for (const commandConfig of command) {
		if (!group.some(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase())) group.push({ group: commandConfig.config.commandCategory.toLowerCase(), cmds: [commandConfig.config.name] });
		else group.find(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()).cmds.push(commandConfig.config.name);
	}

	if (args[0] && ["all", "-a"].includes(args[0].trim())) {
		let all_commands = [];
		group.forEach(commandGroup => {
			commandGroup.cmds.forEach(item => all_commands.push(item));
		});
		let page_num_total = Math.ceil(all_commands.length / 10);
		if (args[1]) {
			check = false;
			page_num_input = parseInt(args[1]);
			if (isNaN(page_num_input)) msg = "please choose";
			else if (page_num_input > page_num_total || page_num_input <= 0) msg = "o";
			else check = true;
		}
		if (check) {
			index_start = (page_num_input) ? (page_num_input * 10) - 10 : 0;
			bonus = index_start;
			index_end = (index_start + 10 > all_commands.length) ? all_commands.length : index_start + 10;
			all_commands = all_commands.slice(index_start, index_end);
			all_commands.forEach(e => {
				msg += `\n${index_start+=1} ${e}: ${commands.get(e).config.description}`;
			})
			msg += `\n\n💦 Page【${page_num_input || 1}/${page_num_total}】`;
			msg += `\n🍄 To view other pages, use: ${prefix}menu [all/-a] [number of pages]`;
			msg += "\n╭──────╮\n     Reply \n╰──────╯reply number";
		}
		var msgg = {body: msg, attachment: imgP}
		return api.sendMessage(msgg, threadID, (error, info) => {
			if (check) {
				global.client.handleReply.push({
					type: "cmd_info",
					bonus: bonus,
					name: this.config.name,
					messageID: info.messageID,
					content: all_commands
				})
			}
		}, messageID)
	}

	let page_num_total = Math.ceil(group.length / 10);
	if (args[0]) {
		check = false;
		page_num_input = parseInt(args[0]);
		if (isNaN(page_num_input)) msg = "Please choose";
		else if (page_num_input > page_num_total || page_num_input <= 0) msg = "o";
		else check = true;
	}
	if (check) {
		index_start = (page_num_input) ? (page_num_input * 10) - 10 : 0;
		bonus = index_start;
		index_end = (index_start + 10 > group.length) ? group.length : index_start + 10;
		group = group.slice(index_start, index_end);
		group.forEach(commandGroup => msg += `\n【${index_start+=1}】 🎭 ${commandGroup.group.toUpperCase()} 🎭`);
		msg += `\n\n💦 Page【${page_num_input || 1}/${page_num_total}】`;
		msg += `\n🍄 To view other pages, use: ${prefix}menu [number of pages]`;
		msg += `\n╭──────╮\n       Reply \n╰──────╯ page number`;
		msg += `\n The bot is run by pervs`;
	}
	var msgg = {body: msg, attachment: imgP}
	return api.sendMessage(msgg, threadID, async (error, info) => {
		global.client.handleReply.push({
			name: this.config.name,
			bonus: bonus,
			messageID: info.messageID,
			content: group
		})
	});
}


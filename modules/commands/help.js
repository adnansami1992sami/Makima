module.exports.config = {
	name: "help",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Hướng dẫn cho người mới",
	commandCategory: "Tiện ích",
	usages: "[Tên module]",
	cooldowns: 5,
  	envConfig: {
		autoUnsend: false,
		unsendMessageAfter: 5000000
	}
};

module.exports.handleEvent = function ({ api, event }) {
	const { commands } = global.client;
	if (!event.body) return;
	const { threadID, messageID, body } = event;
	if (body.indexOf("help") != 0) return;
	const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);

	if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	const command = commands.get(splitBody[1].toLowerCase());

	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

	return api.sendMessage(`「 ${command.config.name} 」\n${command.config.description}\n\n❯ Using: ${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}\n❯ Belonging to the group: ${command.config.commandCategory}\n❯ Waiting time: ${command.config.cooldowns} second(s)\n❯ Power: ${((command.config.hasPermssion == 0) ? "User" : (command.config.hasPermssion == 1) ? "Administrators" : "bot operator" )}\n\n» Module code by ${command.config.credits} «`, threadID, messageID);
}

module.exports.run = function({ api, event, args }) {
	const { commands } = global.client;
	const { threadID, messageID } = event;
	const command = commands.get((args[0] || "").toLowerCase());
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
	
	if (!command) {
		const command = commands.values();
		var group = [], msg = "";
		for (const commandConfig of command) {
			if (!group.some(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase())) group.push({ group: commandConfig.config.commandCategory.toLowerCase(), cmds: [commandConfig.config.name] });
			else group.find(item => item.group.toLowerCase() == commandConfig.config.commandCategory.toLowerCase()).cmds.push(commandConfig.config.name);
		}
		group.forEach(commandGroup => msg += `「 ${commandGroup.group.charAt(0).toUpperCase() + commandGroup.group.slice(1)} 」\n${commandGroup.cmds.join(', ')}\n\n`);

    const moduleName = this.config.name;
		return api.sendMessage(msg + `[ Use: "${(threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX}help each command above" for detailed usage! | Currently available ${commands.size} commands usable on this bot ]🔥`, threadID,
    async function (error, info){
			if (global.configModule[moduleName].autoUnsend) {
				console.log(global.configModule[moduleName].autoUnsend);
				await new Promise(resolve => setTimeout(resolve, global.configModule[moduleName].unsendMessageAfter * 1000));
				return api.unsendMessage(info.messageID);
			} else return;
		});

	}

	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

	return api.sendMessage(`「 ${command.config.name} 」\n${command.config.description}\n\n❯ Using: ${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}\n❯ Belonging to the group: ${command.config.commandCategory}\n❯ Waiting time: ${command.config.cooldowns} Second(s)\n❯ Power: ${((command.config.hasPermssion == 0) ? "User" : (command.config.hasPermssion == 1) ? "Administrators" : "bot operator" )}\n\n» tnx ${command.config.credits} «`, threadID, messageID);
}
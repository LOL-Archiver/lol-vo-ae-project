import { copyFileSync, existsSync, readdirSync, writeFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import { pathToFileURL } from 'url';

import { readJSONSync } from 'fs-extra/esm';
import { parseFile } from 'music-metadata';

import { intersected } from './lib/array-intersect.lib.js';
import { parseRuncom, readRuncomConfig } from './lib/read-runcom-config.js';
import readDictationLines from './lib/read-raw-lines.js';
import formatEvent from './lib/format-event.js';

import { dirDistExtend, dirProject } from './lib/global.js';
import { linesPublic$event } from './lib/public.js';



const formatLine = line => line
	.replace(/\\[n.,，。…、\\]/g, '\n')
	.replace(/\\([!?:“”[\]()！？：【】])/g, '$1\n');

/**
 * @param {string} string
 * @returns {string}
 */
const parsePresetPath = (string, willResolvePath = true) => {
	const result = string?.replace(/\$\{.+?\}/g, text => {
		try {
			// eslint-disable-next-line no-unused-vars
			const D = dirDictations;
			// eslint-disable-next-line no-unused-vars
			const R = resolvePath(dirResources, 'project');
			// eslint-disable-next-line no-unused-vars
			const RP = dirResourcesProject;

			return eval(text.replace(/(^\$\{)|(\}$)/g, ''));
		}
		catch { return text; }
	});

	return willResolvePath && result ? resolvePath(result) : result;
};



/** 命令条 */
const runcom = readRuncomConfig();


/** 默认配置 @type {ProjectConfig} */
const configDefault = readJSONSync(resolvePath(dirProject, 'config.project-default.json'), { throws: false });
/** 用户配置 @type {ProjectConfig} */
const configUser = readJSONSync(resolvePath(dirProject, 'config.project-user.json'), { throws: false });


/** 语音总目录 */
const dirVoices = resolvePath(dirProject, configUser.dirVoices || configDefault.dirVoices);
/** 台词总目录 */
const dirDictations = resolvePath(dirProject, configUser.dirDictations || configDefault.dirDictations);
/** 资源总目录 */
const dirResources = resolvePath(dirProject, configUser.dirResources || configDefault.dirResources);
/** 英雄基础信息 */
const fileChampions = resolvePath(dirProject, configUser.fileChampions || configDefault.fileChampions);


/** 英雄皮肤基础数据 */
const champions = readJSONSync(fileChampions);
/** 是否皮肤模式 */
const isSkinMode = runcom.mode == 'cs';



/** 英雄ID，仅皮肤模式 */
const idChampion = isSkinMode ? Number(runcom.slotMain.slice(0, 3)) : null;
/** 皮肤ID，仅皮肤模式 */
const idSkin = isSkinMode ? Number(runcom.slotMain.slice(3, 6)) : null;
/** 皮肤ID填充 */
const idSkinPad = isSkinMode ? String(idSkin).padStart(3, '0') : null;

/** 英雄基础数据，仅皮肤模式 */
const champion = isSkinMode ? champions[idChampion] : null;
/** 皮肤基础数据，仅皮肤模式 */
const skin = isSkinMode ? champion.skins[idSkin] : null;

/** 主标题 */
let title1 = isSkinMode ? (idSkin == 0 ? champion.title : skin.name.replace(champion.name, '').trim()) : null;
/** 副标题 */
let title2 = isSkinMode ? champion.name : null;



/** 工程资源目录名 */
const nameDirProject = isSkinMode ? `${champion.slot.toLowerCase()}${runcom.slotSub ? `.${runcom.slotSub}` : ''}` : runcom.slot;
/** 工程资源目录 */
const dirResourcesProject = resolvePath(dirResources, 'project', nameDirProject);
/** 工程配置 @type {ProjectConfig} */
const configProject = (await import(pathToFileURL(resolvePath(dirResourcesProject, `config${isSkinMode ? `-${idSkinPad}` : ''}.js`)))).default;



/** 默认头像文件 */
const fileHead = configProject.fileHead ? resolvePath(configProject.fileHead)
	: resolvePath(dirResourcesProject, `header${isSkinMode ? `-${idSkinPad}` : ''}.png`);
/** 默认背景文件 */
const fileBackground = configProject.fileBackground ? resolvePath(configProject.fileBackground)
	: resolvePath(dirResourcesProject, `splash${isSkinMode ? `-${idSkinPad}` : ''}.jpg`);
/** 默认主背景文件 */
const fileBackgroundMain = configProject.fileBackgroundMain ? resolvePath(configProject.fileBackgroundMain)
	: resolvePath(dirResourcesProject, `splash-left${isSkinMode ? `-${idSkinPad}` : ''}.png`);

/** 默认主Logo文件 */
const fileLogo = configProject.fileLogo ? resolvePath(dirResourcesProject, configProject.fileLogo)
	: configUser.fileLogo ? resolvePath(dirProject, configUser.fileLogo)
		: configDefault.fileLogo ? resolvePath(dirProject, configDefault.fileLogo) : null;
/** 默认主Logo文件 */
const fileLogoSide = configProject.fileLogoSide ? resolvePath(dirResourcesProject, configProject.fileLogoSide)
	: configUser.fileLogoSide ? resolvePath(dirProject, configUser.fileLogoSide)
		: configDefault.fileLogoSide ? resolvePath(dirProject, configDefault.fileLogoSide) : null;

/** 背景音乐文件 */
const fileBGM = configProject.fileBGM ? resolvePath(dirResourcesProject, configProject.fileBGM)
	: configUser.fileBGM ? resolvePath(dirProject, configUser.fileBGM)
		: configDefault.fileBGM ? resolvePath(dirProject, configDefault.fileBGM) : null;
/** 水印文件 */
const fileWaterMark = configProject.fileWaterMark ? resolvePath(dirProject, configProject.fileWaterMark)
	: configUser.fileWaterMark ? resolvePath(dirProject, configUser.fileWaterMark)
		: configDefault.fileWaterMark ? resolvePath(dirProject, configDefault.fileWaterMark) : null;


title1 = configProject.title1 ?? title1;
title2 = configProject.title2 ?? title2;
/** 副标题后缀 */
const title2Suffix = configProject.title2Suffix || '';
/** 片尾文本 */
const textEnding = configProject.textEnding || configUser.textEnding || configDefault.textEnding || '';


// 台词文件
const fileDictation = parsePresetPath(configProject.fileDictation) || resolvePath(dirDictations,
	readdirSync(dirDictations).find(file => file.includes(runcom.slot) && file.includes('@zh-cn') && !file.includes('.bak')));
// 语音目录
const dirVoice = configProject.dirVoice || resolvePath(dirVoices,
	readdirSync(dirVoices).find(dir => dir.includes(runcom.slot) && dir.includes('@zh')));



/** 视频参数配置集 @type {Object<string, VideoConfig>} */
const profilesVideo = readJSONSync(resolvePath(dirProject, 'config.video-default.json'), { throws: false });
/** 视频参数配置 @type {VideoConfig} */
const configVideo = Object.assign({},
	profilesVideo.$,
	profilesVideo[configProject.profileVideo || configUser.profileVideo || configDefault.profileVideo],
	configUser,
	configProject,
);



const lineWhoDefault = Object.assign({ head: fileHead }, configProject.lines$who?.$);
/** 台词角色集 */
const lines$who = Object.assign({}, configProject.lines$who, { $: lineWhoDefault });




// 指定与排除台词
const idsLineInclude = configProject.idsLineInclude?.length ? configProject.idsLineInclude : null;
const idsLineExclude = configProject.idsLineExclude?.length ? configProject.idsLineExclude : null;


const linesDictation = (fileDictation ? readDictationLines(fileDictation) : [])
	.filter(lineDictation => {
		if(idsLineExclude
			&& (idsLineExclude.includes(lineDictation.idAudio)
				|| intersected(idsLineExclude, lineDictation.idsSound ?? []))
		) { return false; }

		return idsLineInclude
			? (idsLineInclude.includes(lineDictation.idAudio) || intersected(idsLineInclude, lineDictation.idsSound ?? []))
			: true;
	});



/**
 * @param {DictationLineConfig} lineDictation
 * @param {string} [from]
 * @returns {LineConfig}
 */
const parseDictaionLineConfig = (lineDictation, from) => {
	const extras = lineDictation.extras;

	/** @type {LineConfig} */
	const line = {
		order: null,
		orderRanged: null,

		ids: [lineDictation.idAudio, ...lineDictation.idsSound].join('|'),

		event: lineDictation.eventsRaw.map(eventRaw => formatEvent(eventRaw)).join('、'),
		caption: lineDictation.caption,

		mark: extras.mark?.[0] ?? null,
		cond: extras.cond?.[0] ?? null,

		duration: 0,
		audio: null,

		color: null,
		head: null,
		target: null,
		skill: null,

		side: extras.side?.[0] ?? 'right',
		from,

		lineDictation,
	};


	if(extras.head) { line.head = '${R}' + `/${extras.head.join('/')}.png`; }
	if(extras.target) { line.target = '${R}' + `/${extras.target.join('/')}.png`; }
	if(extras.skill) {
		if(isSkinMode) {
			line.skill = '${RP}' + `/skill-${extras.skill[0]}.png`;
		}
		else {
			line.skill = '${R}' + `/${extras.skill.join('/')}.png`;
		}
	}


	return line;
};


/** 额外台词集 @type {LineConfig[]} */
const linesExtra = configProject.linesExtra?.map(lineExtra => parseDictaionLineConfig(lineExtra, 'project')) ?? [];

if(runcom.slotsExtra?.length) {
	for(const slotExtra of runcom.slotsExtra) {
		const configExtra = configProject.configsExtra[slotExtra];
		if(!configExtra) { continue; }


		linesExtra.push(...readDictationLines(parsePresetPath(configExtra.fileDictation))
			.map(lineDictation => parseDictaionLineConfig(lineDictation, slotExtra))
		);
	}
}


/** @type {LineConfig[]} */
const linesFinal = [];

for(const lineDictation of linesDictation) {
	const extras = lineDictation.extras;


	// 优先级0：台词文件自身及其额外指令
	const line = parseDictaionLineConfig(lineDictation);

	linesFinal.push(line);
	line.order = linesFinal.length;


	if(extras.before) {
		for(const idBefore of extras.before) {
			const lineBefore = linesExtra.find(lineDictationExtra => lineDictationExtra.idAudio == idBefore || lineDictationExtra.idsSound.includes(idBefore));
			if(!lineBefore) { continue; }

			linesFinal.splice(linesFinal.length - 1, 0, lineBefore);
			lineBefore.order = linesFinal.length;
		}
	}

	if(extras.after) {
		for(const idAfter of extras.after) {
			const lineAfter = linesExtra.find(lineDictationExtra => lineDictationExtra.idAudio == idAfter || lineDictationExtra.idsSound.includes(idAfter));
			if(!lineAfter) { continue; }

			linesFinal.push(lineAfter);
			lineAfter.order = linesFinal.length;
		}
	}
}


// 范围限制
const range = configProject.range || configUser.range || configDefault.range || null;
if(range && range[1] >= range[0]) {
	linesFinal.splice(0, range[0] - 1);
	linesFinal.splice(range[1] - range[0] + 1, linesFinal.length);

	for(let order = 0; order < linesFinal.length; order++) {
		linesFinal[order].orderRanged = order + 1;
	}
}



// 对话预处理
const linesDialog$id = {};

/** 对话成员 */
const whosDialogist$slot = Object.assign({ A: '$' }, configProject.dialogists);
const whosDialogist = [whosDialogist$slot.A, whosDialogist$slot.B, whosDialogist$slot.C, whosDialogist$slot.D].filter(s => s);



for(let indexDialog = 1; indexDialog <= configProject.dialogs?.length ?? 0; indexDialog++) {
	const dialog = configProject.dialogs[indexDialog - 1];

	const textIndexDialog = String(indexDialog).padStart(2, '0');

	let [rawRevs, rawPlayers, rawTargets] = dialog.trim().split('|');

	// 台词顺序
	const orderIDLine = rawRevs.split('>');
	// 演员顺序
	const orderWhoPlayer = (rawPlayers = rawPlayers||'A').split('').map(slot => whosDialogist$slot[slot] ?? slot);
	// 目标顺序
	const orderWhoTarget = (rawTargets || (rawPlayers == 'A' ? 'B' : '')).split('').map(slot => whosDialogist$slot[slot] ?? slot);


	// 补全顺序
	const indexPlayerRawLast = whosDialogist.indexOf(orderWhoPlayer[orderWhoPlayer.length - 1]);
	const lengthPlayerRaw = orderWhoPlayer.length;
	while(orderWhoPlayer.length < orderIDLine.length) {
		orderWhoPlayer.push(whosDialogist[
			(orderWhoPlayer.length + 1 - lengthPlayerRaw + indexPlayerRawLast) % whosDialogist.length
		]);
	}

	const indexTargetRawLast = whosDialogist.indexOf(orderWhoTarget[orderWhoTarget.length - 1]);
	const lengthTargetRaw = orderWhoTarget.length;
	while(whosDialogist.length == 2 && orderWhoTarget.length < orderIDLine.length) {
		orderWhoTarget.push(whosDialogist[
			(orderWhoTarget.length + 1 - lengthTargetRaw + indexTargetRawLast) % whosDialogist.length
		]);
	}


	const alignOrder = Math.max(...whosDialogist.map(who => who.length), 8);
	globalThis.console.log(`对话${textIndexDialog} [${dialog.trim()}]\n`,
		`\t台词: ${orderIDLine.map(order => order.padStart(alignOrder, ' ')).join(' => ')}\n`,
		`\t角色: ${orderWhoPlayer.map(order => order.padStart(alignOrder, ' ')).join(' => ')}\n`,
		`\t目标: ${orderWhoTarget.map(order => order.padStart(alignOrder, ' ')).join(' => ')}\n`,
	);


	for(let indexRev = 1; indexRev <= orderIDLine.length; indexRev++) {
		const idLine = orderIDLine[indexRev - 1];
		const whoPlayer = orderWhoPlayer[indexRev - 1];
		const whoTarget = orderWhoTarget[indexRev - 1];

		const linePlayer = lines$who[whoPlayer];
		const lineTarget = lines$who[whoTarget];


		/** @type {LineConfig} */
		const lineDialog = {};

		if(indexRev == 1) { lineDialog.mark = `对话${textIndexDialog} 开始`; }
		else if(indexRev == orderIDLine.length) { lineDialog.mark = `对话${textIndexDialog} 结束`; }

		if(indexRev > 1) { lineDialog.event = formatEvent(`[标题:对话${textIndexDialog}-${indexRev}]`); }


		if(linePlayer) { Object.assign(lineDialog, linePlayer); }
		if(lineTarget) { lineDialog.target = lineTarget.head; }


		linesDialog$id[idLine] = lineDialog;
	}
}



// 读取目录文件列表换成
/** @type {Object<string,string[]>} */
const filesAudio$dirVoice = {};
const slotsEventTrans$event = { '选用': 'pick', '禁用': 'ban' };

const colorsLine$color = new Set();

for(const line of linesFinal) {
	/** @type {DictationLineConfig} */
	const lineDictation = line.lineDictation;



	// 优先级1：公共事件匹配
	for(const eventRaw of lineDictation.eventsRaw) {
		const lineEventMatched = linesPublic$event[eventRaw];
		if(!lineEventMatched) { continue; }

		Object.assign(line, lineEventMatched);
	};



	// 优先级2：工程公共资源
	Object.assign(line, { color: configProject.color ?? null, head: fileHead ?? null });



	// 优先级3：工程事件匹配
	for(const eventRaw of lineDictation.eventsRaw) {
		const lineEventMatched = configProject.lines$event?.[eventRaw];
		if(!lineEventMatched) { continue; }

		Object.assign(line, lineEventMatched);
	};



	// 优先级4：工程角色匹配
	const lineWho = lines$who[lineDictation.extras.who?.[0] ?? '$'];

	Object.assign(line, lineWho);



	// 优先级5：对话匹配
	const linesIDDialog = [lineDictation.idAudio, ...lineDictation.idsSound].map(idSound => linesDialog$id[idSound]).filter(l => l);

	for(const lineID of linesIDDialog) { Object.assign(line, lineID); }



	// 优先级6：工程台词ID匹配
	const linesID = [lineDictation.idAudio, ...lineDictation.idsSound].map(idSound => configProject.lines$id?.[idSound]).filter(l => l);

	for(const lineID of linesID) { Object.assign(line, lineID); }



	// 格式化台词
	line.caption = formatLine(line.caption);
	if(line.cond) { line.cond = `子条件：${line.cond}`; line.cond = formatLine(line.cond); }
	if(line.mark) { line.mark = formatLine(line.mark); }
	if(line.head) { line.head = parsePresetPath(line.head); }
	if(line.target) { line.target = parsePresetPath(line.target); }
	if(line.skill) { line.skill = parsePresetPath(line.skill); }



	// 处理音频和读取时长
	const dirVoiceLine = line.from && line.from != 'project' ? configProject.configsExtra[line.from]?.dirVoice : dirVoice;

	if(!line.audio && dirVoiceLine) {
		const nameFileMatch = (filesAudio$dirVoice[dirVoiceLine] || (filesAudio$dirVoice[dirVoiceLine] = readdirSync(dirVoiceLine)))
			.find(name => name.includes(line.nameAudio) || line.ids?.split('|').reduce((acc, id) => acc + name.includes(id), 0) > 0);

		if(nameFileMatch) { line.audio = resolvePath(dirVoiceLine, nameFileMatch); }
	}

	if(!line.audio && (line.event == '选用' || line.event == '禁用' || line.event == '选用、禁用')) {
		line.audio = resolvePath(dirResourcesProject, `voice-${slotsEventTrans$event[line.event] ?? 'pick'}.wav`);
	}

	line.audio = parsePresetPath(line.audio ?? '');

	if(existsSync(line.audio)) { line.duration = (await parseFile(line.audio)).format.duration; }



	colorsLine$color.add(line.color);



	// 移除听写台词
	delete line.lineDictation;
}



// 片头背景预处理
const infosSplashOpener = [];
const offsetsSplashOpener$slot = readJSONSync(resolvePath(dirResources, 'opener-splash-offset.json'), { throws: false }) ?? {};
for(const rawRuncom of runcom.runcoms) {
	const runcomOld = parseRuncom(rawRuncom);
	if(runcomOld.mode != 'cs') { continue; }


	const idChampionOld = Number(runcomOld.slotMain.slice(0, 3));
	const idSkinOld = Number(runcomOld.slotMain.slice(3, 6));
	const championOld = champions[idChampionOld];

	const nameDirProjectOld = `${championOld.slot.toLowerCase()}${runcom.slotSub ? `.${runcom.slotSub}` : ''}`;


	infosSplashOpener.push({
		file: resolvePath(dirResources, 'project', nameDirProjectOld, `splash-${String(idSkinOld).padStart(3, '0')}.jpg`),
		offset: offsetsSplashOpener$slot[runcomOld.slot] ?? 0,
	});


	if(infosSplashOpener.length >= 8) { break; }
}


// 全局注释
const marksGlobal = configProject.marksGlobal ?? [];
for(const markGlobal of marksGlobal) {
	markGlobal.text = formatLine(markGlobal.text);
}


/** @type {FinalProjectInfo} */
const infoProjectFinal = {
	fileBackground,
	fileBackgroundMain,
	fileLogo,
	fileLogoSide,

	fileBGM,
	fileWaterMark,


	widthVideo: configVideo.widthVideo,
	heightVideo: configVideo.heightVideo,
	landscape: configVideo.widthVideo > configVideo.heightVideo,
	pixelAspect: configVideo.pixelAspect,
	frameRate: configVideo.frameRate,

	durationInterval: configVideo.durationInterval,
	durationOpener: configVideo.durationOpener,
	durationEnding: configVideo.durationEnding,
	durationTitle: configVideo.durationTitle,
	durationExtendLine: configVideo.durationExtendLine,

	sizeFontLine: configVideo.sizeFontLine,
	sizeFontCond: configVideo.sizeFontCond,
	sizeFontMark: configVideo.sizeFontMark,
	paddingLine: configVideo.paddingLine,
	paddingCond: configVideo.paddingCond,
	paddingMark: configVideo.paddingMark,
	paddingTopExtra$event: configVideo.paddingTopExtra$event,
	sizeBoxHeader: configVideo.sizeBoxHeader,
	heightLeading: configVideo.heightLeading,
	gapLive: configVideo.gapLive,
	gapBoxLive: configVideo.gapBoxLive,
	paddingSideVideo: configVideo.paddingSideVideo,
	paddingBottomVideo: configVideo.paddingBottomVideo,


	simple: configProject.simple || configUser.simple || configDefault.simple || false,
	mute: configProject.mute || configUser.mute || configDefault.mute || false,


	title1,
	title2,
	title2Suffix,
	textEnding,
	titleComp: `${runcom.slot} ${!isSkinMode ? '特别篇' : (idSkin > 0 ? '新皮肤' : '新英雄')} ${title1} ${title2}${title2Suffix || ''}${configVideo.widthVideo > configVideo.heightVideo ? '' : ' 竖屏'}`,

	colorsLine: [...colorsLine$color],

	lines: linesFinal,

	infosSplashOpener: infosSplashOpener,


	marksGlobal,
};



const fileInfo = resolvePath(dirResources, 'info', `${runcom.slot}.json`);
const fileInfoDist = resolvePath(dirDistExtend, 'info.json');

writeFileSync(fileInfo, JSON.stringify(infoProjectFinal, null, '\t'));
copyFileSync(fileInfo, fileInfoDist);
writeFileSync(resolvePath(dirDistExtend, 'paths.js'), `this.PATH_INFO = '${fileInfoDist.replace(/\\/g, '\\\\')}';`);



globalThis.console.log(`已更新 ${infoProjectFinal.titleComp}`);

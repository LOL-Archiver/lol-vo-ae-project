import { copyFileSync, readdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import { readJSONSync } from 'fs-extra/esm';

import { dirDistExtend } from './lib/global.js';
import parseLine from './lib/parse-line.js';
import readRawLines from './lib/read-raw-lines.js';

import { eventsAssignPublic$event } from './reso/conf/public.js';

import { C } from './config.js';



const parseConfig = string => string?.replace(/\$\{.+?\}/g, text => {
	try {
		C;
		return eval(text.replace(/(^\$\{)|(\}$)/g, ''));
	}
	catch { return text; }
});



const [eventsRawDict = [], linesDict = []] = C.file.dictation ? readRawLines(C.file.dictation, Object.assign({}, eventsAssignPublic$event, C.eventsAssign$event)) : [];


// 附加台词
if(C.slotsExtra.length) {
	for(const slotExtra of C.slotsExtra) {
		const extraProject = C.extrasProject[slotExtra];
		if(!extraProject) { continue; }


		const [, linesDictExtra = []] = readRawLines(parseConfig(extraProject.fileDictation));

		linesDict.push(linesDictExtra.map(lineRaw =>
			Object.assign(lineRaw, { from: slotExtra }, extraProject.lineAssign)
		));
	}
}



// 指定与排除台词
const idsLineIncludes = C.idsLineIncludes?.length ? C.idsLineIncludes : null;
const idsLineExcludes = C.idsLineExcludes?.length ? C.idsLineExcludes : null;


const events = idsLineIncludes ? [] : eventsRawDict;

const findLine = id => {
	for(const event of eventsRawDict) {
		for(const line of event.lines) {
			if(line.idAudio === id || line.idsSound?.includes(id)) {
				return { event, line };
			}
		}
	}

	return {};
};
const matchLine = id => {
	const { event, line } = findLine(id);

	const eventNew = Object.assign({}, event);

	eventNew.lines = [line];

	events.push(eventNew);
};
const hideLine = id => {
	const { line } = findLine(id);

	line ? line.hide = true : void 0;
};

idsLineExcludes?.forEach((id) => hideLine(id));
idsLineIncludes?.forEach((id) => matchLine(id));



// 对话处理
const dialogists = Object.keys(C.dialogist ?? {});

const extrasLine = C.linesAssign$id ?? (C.linesAssign$id = {});
for(let indexDialog = 1; indexDialog <= C.dialogs?.length ?? 0; indexDialog++) {
	const dialog = C.dialogs[indexDialog - 1];
	const textIndexDialog = String(indexDialog).padStart(2, '0');

	const [rawRevs, rawPlayers, rawTargets] = dialog.trim().split('-');
	const revs = rawRevs.split('>');
	const players = (rawPlayers || 'A').split('');
	const targets = (rawTargets || 'B').split('');


	const indexPlayerRawLast = dialogists.indexOf(players[players.length - 1]);
	const lengthPlayerRaw = players.length;
	while(players.length < revs.length) {
		players.push(dialogists[
			(players.length + 1 - lengthPlayerRaw + indexPlayerRawLast) % dialogists.length
		]);
	}

	const indexTargetRawLast = dialogists.indexOf(targets[targets.length - 1]);
	const lengthTargetRaw = targets.length;
	while(dialogists.length == 2 && targets.length < revs.length) {
		targets.push(dialogists[
			(targets.length + 1 - lengthTargetRaw + indexTargetRawLast) % dialogists.length
		]);
	}


	for(let indexRev = 1; indexRev <= revs.length; indexRev++) {
		const rev = revs[indexRev - 1];
		let player = players[indexRev - 1];
		let target = targets[indexRev - 1];

		const extraLine = extrasLine[rev] ?? (extrasLine[rev] = {});


		if(indexRev == 1) { extraLine.mark = `对话${textIndexDialog} 开始`; }
		else if(indexRev == revs.length) { extraLine.mark = `对话${textIndexDialog} 结束`; }

		if(indexRev > 1) { extraLine.event = `标题:对话${textIndexDialog}-${indexRev}`; }

		if(player && C.dialogist[player] != 'self') { extraLine.head = C.dialogist[player]; }
		if(target) { extraLine.target = C.dialogist[target] == 'self' ? C.file.head : C.dialogist[target]; }
	}
}


const linesFinal = [];

const namesAudio = readdirSync(C.dir.voice);

for(const event of events) {
	for(const line of event.lines) {
		const eventSlice = Object.assign({}, event);
		delete eventSlice.lines;

		linesFinal.push(...(await parseLine(
			line,
			eventSlice,
			namesAudio,
			C.lines,
			linesDict,
		)));
	}
}

const linesSpecial = C.linesSpecial ?? [];
for(const lineSpecial of linesSpecial) {
	linesFinal.push(...(await parseLine(lineSpecial)));
}



// 片头背景预处理
//
const infosSplashesOpener = [];
const champions = readJSONSync(resolve(C.dir.database, 'zh_cn.json'));
const offsetsSplashOpener$slot = readJSONSync(resolve(C.dir.reso, 'opener-splash-offset.json'), { throws: false }) ?? {};
for(const slotOld of C.slots) {
	const [mode, slotFull] = slotOld.split(':');
	if(mode != 'cs') { continue; }


	const [slot] = slotFull.split('+');

	const idChampion = slot.slice(0, 3);
	const idSkin = slot.slice(3, 6);


	const champion = champions[Number(idChampion)];


	infosSplashesOpener.push({
		file: resolve(C.dir.reso, 'project', champion?.slot?.toLowerCase(), `splash-${idSkin}.jpg`),
		offset: offsetsSplashOpener$slot[slot] ?? 0,
	});


	if(infosSplashesOpener.length >= 8) { break; }
}


/** @type {VideoConfig} */
const I = {
	video: {
		width: C.video.width,
		height: C.video.height,
		landscape: C.video.width > C.video.height,

		pixelAspect: C.video.pixelAspect,
		frameRate: C.video.frameRate,

		simple: C.video.simple,
		mute: C.video.mute,
		onlyMark: C.video.onlyMark,
		range: C.video.range,

		duration: {
			interval: C.video.duration.interval,

			opener: C.video.duration.opener,
			ending: C.video.duration.ending,

			title: C.video.duration.title,
			extendLine: C.video.duration.extendLine,
		},

		size: {
			fontLine: C.video.size.fontLine,
			fontCond: C.video.size.fontCond,
			fontMark: C.video.size.fontMark,

			paddingLine: C.video.size.paddingLine,
			paddingCond: C.video.size.paddingCond,
			paddingMark: C.video.size.paddingMark,

			paddingTopExtra$event: C.video.size.paddingTopExtra$event,

			sizeBoxHeader: C.video.size.sizeBoxHeader,
			heightLeading: C.video.size.heightLeading,

			gapLive: C.video.size.gapLive,
			gapBoxLive: C.video.size.gapBoxLive,

			paddingSideVideo: C.video.size.paddingSideVideo,
			paddingBottomVideo: C.video.size.paddingBottomVideo,
		}
	},

	slotFull: C.slotFull,
	slot: C.slot,
	slotMain: C.slotMain,
	slotSub: C.slotSub,
	slotsExtra: C.slotsExtra,

	idChampion: C.idChampion,
	idSkin: C.idSkin,
	idSkinPad: C.idSkinPad,

	title1: C.title1,
	title2: C.title2,
	title2Suffix: C.title2Suffix,
	titleComp: `${C.video.width > C.video.height ? '[横屏] ' : '[竖屏] '}${C.slot} ${C.mode == 'sp' ? '特别' : (C.idSkin > 0 ? '皮肤' : '英雄')} ${C.title1} ${C.title2}${C.title2Suffix || ''}`,
	color: C.color,
	textInfo: C.textInfo,

	dir: {
		voices: C.dir.voices,
		dictation: C.dir.dictation,
		database: C.dir.database,
		reso: C.dir.reso,

		resoProject: C.dir.resoProject,
		voice: C.dir.voice,
	},

	file: {
		bgm: C.file.bgm,
		waterMark: C.file.waterMark,

		head: C.file.head,
		background: C.file.background,
		backgroundMain: C.file.backgroundMain,
		dictation: C.file.dictation,
		shade: C.file.shade,
	},

	infosSplashesOpener,

	lines: linesFinal,
};



const fileInfo = resolve(C.dir.reso, 'info', `${C.slot}.json`);
const fileInfoDist = resolve(dirDistExtend, 'info.json');

writeFileSync(fileInfo, JSON.stringify(I, null, '\t'));
copyFileSync(fileInfo, fileInfoDist);
writeFileSync(resolve(dirDistExtend, 'paths.js'), `this.PATH_INFO = '${fileInfoDist.replace(/\\/g, '\\\\')}';`);



globalThis.console.log(`已生成 ${I.titleComp}`);

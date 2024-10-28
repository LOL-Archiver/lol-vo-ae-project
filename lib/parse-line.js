import { existsSync, readdirSync } from 'fs';
import { resolve } from 'path';

import { parseFile } from 'music-metadata';

import { C } from '../config.js';

import formatEvent from './format-event.js';



const eventsTrans = { '选用': 'pick', '禁用': 'ban' };

const parseConfig = string => string?.replace(/\$\{.+?\}/g, text => {
	try {
		C;
		return eval(text.replace(/(^\$\{)|(\}$)/g, ''));
	}
	catch { return text; }
});

const formatLine = (line) => line
	.replace(/\\[n.,，。…、\\]/g, '\n')
	.replace(/\\([!?:“”[\]()！？：【】])/g, '$1\n');

const filesAudio$dirVoice = {};

const parseLine = async (lineDict, event = {}, namesAudio = [], extrasLine = {}, linesDict = []) => {
	if(lineDict.extras.find(e => e.type == 'ignore')) { return []; }


	const result = [];

	const lineExtra = extrasLine[Object.keys(extrasLine).find(e => lineDict.idsSound.includes(e) || lineDict.idAudio == e || lineDict.hash == e)] ?? {};


	const linesBefore = [
		...(lineExtra.befores ?? []),
		...lineDict.extras.filter(e => e.type == 'before').map(extra => linesDict
			.find(line =>
				line.idsSound.includes(extra.params[0]) && line.from &&
				(extra.params[1] ? line.from == extra.params[1] : true)
			)).filter(l => l)
	];
	const linesAfter = [
		...(lineExtra.afters ?? []),
		...lineDict.extras.filter(e => e.type == 'after').map(extra => linesDict
			.find(line =>
				line.idsSound.includes(extra.params[0]) && line.from &&
				(extra.params[1] ? line.from == extra.params[1] : true)
			)).filter(l => l)
	];



	// 前置台词
	for(const lineRaw of linesBefore) {
		result.push(...(await parseLine(lineRaw, {}, namesAudio, extrasLine, linesDict)).map((line) => {
			if(!line.duration) { line.duration = C.video.duration.extendLine; }

			return line;
		}));
	}


	const extraHead = lineDict.extras.find(e => e.type == 'head');
	let headExtra;
	if(extraHead) {
		headExtra = '${C.dir.reso}' + `/project/${extraHead.params.join('/')}.png`;
	}
	const extraTarget = lineDict.extras.find(e => e.type == 'target');
	let targetExtra;
	if(extraTarget) {
		targetExtra = '${C.dir.reso}' + `/project/${extraTarget.params.join('/')}.png`;
	}

	const extraSkill = lineDict.extras.find(e => e.type == 'skill');
	let skillExtra;
	if(extraSkill) {
		const [file] = extraSkill.params;

		skillExtra = '${C.dir.resoProject}' + `/skill-${file}.png`;
	}




	const line = Object.assign({
		idAudio: lineDict.idAudio,
		idsSound: lineDict.idsSound.join('|'),
		hash: lineDict.hash,

		duration: 0,
		audio: null,

		head: headExtra ?? lineDict.head ?? C.file.head,
		target: targetExtra ?? lineDict.target,
		skill: skillExtra ?? lineDict.skill,

		event: lineDict.event,
		line: formatLine(lineDict.line).replace(/^\+/g, ''),
		mark: lineDict.extras.find(e => e.type == 'mark')?.params[0],
		cond: lineDict.extras.find(e => e.type == 'cond')?.params[0],

		side: 'right',
		colorBoxLine: lineDict.colorBoxLine,
	}, event);
	line.head = line.head ? resolve(parseConfig(line.head)) : undefined;
	line.target = line.target ? resolve(parseConfig(line.target)) : undefined;
	line.skill = line.skill ? resolve(parseConfig(line.skill)) : undefined;

	result.push(Object.assign(line, lineExtra));
	delete line.befores;
	delete line.afters;


	if(line.cond) { line.cond = `子条件：${line.cond}`; line.cond = formatLine(line.cond); }
	if(line.mark) { line.mark = formatLine(line.mark); }
	if(line.event) { line.event = line.event.split('、').map((eventRaw) => formatEvent(eventRaw)).join('、'); }


	let file = lineExtra.file;
	if(!file && lineExtra.folder) {
		if(lineDict.file) {
			file = resolve(C.dir.voices, lineExtra.folder, lineDict.file);
		}
		else {
			const dirVoice = resolve(C.dir.voices, parseConfig(lineExtra.folder));

			const nameFileMatch = (filesAudio$dirVoice[dirVoice] || (filesAudio$dirVoice[dirVoice] = readdirSync(dirVoice)))
				.find(name =>
					Boolean(line.idsSound.split('|').reduce((acc, idSound) => acc + name.includes(idSound), 0)) ||
					name.includes(line.idAudio) ||
					name.includes(line.hash)
				);

			if(nameFileMatch) { file = resolve(dirVoice, nameFileMatch); }
		}
	}


	const eventNow = line.event;

	// 读取音频
	const fileAudio = parseConfig(file ?? '') ||
		(
			(eventNow == '选用' || eventNow == '禁用' || eventNow == '选用、禁用')
				? resolve(C.dir.resoProject, `voice-${eventsTrans[eventNow] ?? 'pick'}.wav`)
				: resolve(C.dir.voice, namesAudio.find(name =>
					Boolean(line.idsSound.split('|').reduce((acc, idSound) => acc + name.includes(idSound), 0)) ||
					name.includes(line.idAudio) ||
					name.includes(line.hash)
				) ?? 'null')
		);

	if(existsSync(fileAudio)) {
		line.duration = (await parseFile(fileAudio)).format.duration;
		line.audio = fileAudio;
	}



	// 后置台词
	for(const lineRaw of linesAfter) {
		result.push(...await parseLine(lineRaw, {}, namesAudio, extrasLine, linesDict));
	}



	return result.filter(lineParsed => C.video.onlyMark ? lineParsed.mark : true);
};


export default parseLine;

import { readFileSync } from 'fs';



/**
 * 基于听写格式读取台词
 * @param {string} fileDictation
 * @returns {DictationLineConfig[]}
 */
const readRawLines = fileDictation => {
	const textsLine = readFileSync(fileDictation, 'UTF8').split('\n')
		.map(text => text.trim())
		.filter(text => text && !text.startsWith('<!--'));


	/** @type {DictationLineConfig[]} */
	const linesDictation = [];


	let lineStarted = false;
	/** @type {string} */
	let eventNow;
	for(const textLine of textsLine) {
		if(!lineStarted) {
			if(textLine == '## Lines:台词') { lineStarted = true; }

			continue;
		}


		if(textLine.startsWith('### ')) {
			eventNow = textLine.replace('### **', '').replace('**', '').replace(/^\d+ /, '');
		}
		else {
			const [, strMeta, caption] = textLine.match(/^- `(.*?)(?<!\\)` (.*)$/) ?? [];
			if(!strMeta || !caption) { continue; }


			const [strIDsSound, idAudio, ...strExtras] = strMeta.trim().split(/(?<!\\)\|/);

			/** @type {DictationLineConfig} */
			const lineRaw = {
				idAudio: idAudio,
				idsSound: strIDsSound.split(/(?<!\\)\./),

				eventsRaw: eventNow.split('、'),
				caption: caption.trim(),

				extras: strExtras.reduce((extras, str) => {
					const [type, strParams = ''] = str.split(/(?<!\\):/);

					extras[type] = strParams.split(/(?<!\\),/);

					return extras;
				}, {}),
			};

			linesDictation.push(lineRaw);
		}
	}


	return linesDictation;
};



export default readRawLines;

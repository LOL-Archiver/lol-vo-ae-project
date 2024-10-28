import { readFileSync } from 'fs';



/**
 *
 * @param {string} file
 * @param {Object<string, EventConfig>} eventsAssign$event
 * @returns {[RawEventConfig[], RawLineConfig[]]}
 */
const readRawLines = (file, eventsAssign$event = {}) => {
	const textsLine = readFileSync(file, 'UTF8').split('\n')
		.map(text => text.trim())
		.filter(text => text && !text.startsWith('<!--'));


	/** @type {RawEventConfig[]} */
	const events = [];
	/** @type {RawLineConfig[]} */
	const linesRaw = [];


	let lineStarted = false;
	let eventNow;
	for(const textLine of textsLine) {
		if(!lineStarted) {
			if(textLine == '## Lines:台词') { lineStarted = true; }

			continue;
		}


		if(textLine.startsWith('### ')) {
			/** @type {RawEventConfig} */
			const event = eventNow = {
				event: textLine.replace('### **', '').replace('**', '').replace(/^\d+ /, ''),
				lines: [],
			};

			events.push(Object.assign(event, eventsAssign$event[event.event] ?? {}));
		}
		else {
			const [, rawMeta, line] = textLine.match(/^- `(.*?)(?<!\\)` (.*)$/) ?? [];
			if(!rawMeta || !line) { continue; }


			const [rawIDSound, idAudio, ...rawExtras] = rawMeta.trim().split(/(?<!\\)\|/);

			/** @type {RawLineConfig} */
			const lineRaw = {
				idAudio: idAudio,
				idsSound: rawIDSound.split(/(?<!\\)\./),
				extras: rawExtras.map(raw => {
					const [type, rawParams = ''] = raw.split(/(?<!\\):/);

					return { type, params: rawParams.split(/(?<!\\),/) };
				}),

				event: eventNow.event,
				line: line.trim(),
			};

			eventNow.lines.push(lineRaw);
			linesRaw.push(lineRaw);
		}
	}


	return [events, linesRaw];
};



export default readRawLines;

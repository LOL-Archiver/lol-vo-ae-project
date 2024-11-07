/// <reference path="../bases.d.ts" />



$.writeln('-------date-------'.replace('date', new Date()));


const events = CalcDuration();


CompMain.duration = D.full;

AddGlobal();

AddBackGround();

if(!I.simple) {
	AddTitle();
}


// 开头
const compOpener = AddOpener();

const layerOpener = CompMain.layers.add(compOpener, D.opener);
layerOpener.startTime = D.opener;
layerOpener.stretch = -100;


// 台词
let accumDuration = D.opener + D.title - 0.5;
EnumLine(events, (line, lid, index) => {
	const yCenter = 540;

	let yLine = yCenter + (line.heightLive + I.gapLive);
	let indexLine = index;

	let durationLine = line.durationLine;

	while(yLine >= -yCenter) {
		const lineInfoExtra = LinesInfoExtra[++indexLine];
		if(!lineInfoExtra) { break; }


		const nextDuration = lineInfoExtra[0];
		const nextBoxHeight = lineInfoExtra[1] + I.gapLive;

		yLine -= nextBoxHeight;

		durationLine += nextDuration + D.interval;
	}

	const compLine = AddLine(line, lid, DirLine, durationLine);

	AddLineScroll(line, compLine, index, accumDuration, durationLine);

	accumDuration += line.duration + D.interval;

	$.writeln(`${index}: ${line.caption.replace(/\n/g, '，')}`);
});


AddGlobalMark();
$.writeln('Statge: AddGlobalMark');

if(!I.simple) {
	AddBGM();
	$.writeln('Statge: AddBGM');
	AddCounter();
	$.writeln('Statge: AddCounter');
	AddEnding();
	$.writeln('Statge: AddEnding');
}


CompMain.openInViewer();


$.writeln('-------date-------'.replace('date', new Date()));

'成功';

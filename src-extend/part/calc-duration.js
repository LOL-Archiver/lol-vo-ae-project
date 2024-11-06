this.CalcDuration = () => {
	const lines = I.lines;


	let durationLines = 0;

	D.lengthLine = 0;
	EnumLine(lines, () => D.lengthLine++);

	EnumLine(lines, (line, lid, index) => {
		const [widthTextLine, heightTextLine, countRowBoxLine] = GetBoxSize(line.caption);

		line.widthTextLine = widthTextLine;
		line.heightTextLine = heightTextLine;
		line.countRowLine = countRowBoxLine;

		line.heightLive =
			+ I.paddingLine
			+ heightTextLine
			+ I.paddingLine
			+ I.paddingTopExtra$event
			+ I.sizeBoxHeader / 2;


		if(line.cond) {
			const [widthTextCond, heightTextCond] = GetBoxSizeMark(line.cond);

			line.widthTextCond = widthTextCond;
			line.heightTextCond = heightTextCond;

			line.heightLive += I.paddingCond + heightTextCond + I.paddingCond;
		}


		if(line.mark) {
			const [widthTextMark, heightTextMark] = GetBoxSizeMark(line.mark);

			line.widthTextMark = widthTextMark;
			line.heightTextMark = heightTextMark;

			line.heightLive += I.gapBoxLive + I.paddingMark + heightTextMark + I.paddingMark;
		}



		LinesInfoExtra.push([line.duration, line.heightLive]);

		const durationLine = line.duration + D.interval;

		durationLines += durationLine;

		line.durationLine = durationLine + 0.4 + (index >= D.lengthLine - 3 ? 4 : 0);
	});

	CompTest.remove();

	D.lines = durationLines;

	D.ending += 4.5;

	D.full = D.opener + D.lines + D.ending;
	D.linesEnd = D.opener + D.lines;

	$.writeln(`${I.titleComp} ${D.full.toFixed(2)} ${D.lines.toFixed(2)}`);

	return lines;
};

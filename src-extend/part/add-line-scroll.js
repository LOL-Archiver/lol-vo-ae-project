this.AddLineScroll = (line, compLine, index, accumDuration, durationLine) => {
	const xCenter = I.widthVideo / 2 - (I.landscape ? 0 : 220);
	const yCenter = I.heightVideo / 2;

	const layerLine = CompMain.layers.add(compLine, durationLine);

	layerLine.startTime = accumDuration;

	layerLine.transform.position.setValue([xCenter, yCenter + line.heightLive + I.paddingBottomVideo]);

	if(!I.landscape) {
		layerLine.transform.scale.setValue([80, 80]);
	}


	layerLine.transform.opacity.setValueAtTime(accumDuration, 100);
	layerLine.transform.opacity.setValueAtTime(accumDuration + line.duration, 100);
	layerLine.transform.opacity.setValueAtTime(accumDuration + line.duration + 0.1, 80);


	let yLine = yCenter + (line.heightLive + I.paddingBottomVideo);
	let accumDurationLine = accumDuration;

	while(yLine >= -yCenter) {
		const lineInfoExtra = LinesInfoExtra[index++];
		if(!lineInfoExtra) { break; }


		const nextDuration = lineInfoExtra[0];
		const nextBoxHeight = lineInfoExtra[1] + I.gapLive;

		layerLine.transform.position.setValueAtTime(accumDurationLine, [xCenter, yLine]);

		layerLine.transform.position.setValueAtTime(accumDurationLine + 0.1, [xCenter, yLine -= nextBoxHeight]);

		accumDurationLine += nextDuration + D.interval;
	}
};

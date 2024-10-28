this.AddCounter = () => {
	const layerWaterMark = CompMain.layers.add(GetFootage(I.file.waterMark));

	layerWaterMark.transform.scale.setValue([14, 14]);
	layerWaterMark.transform.position.setValue([40, I.video.height - (40 + 40)]);

	layerWaterMark.startTime = D.opener + 1;
	layerWaterMark.duration = D.linesEnd;
	layerWaterMark.transform.opacity.setValueAtTime(D.opener + 1, 0);
	layerWaterMark.transform.opacity.setValueAtTime(D.opener + 3, 100);


	const effectDropShadowWaterMark = layerWaterMark.effect.addProperty('ADBE Drop Shadow');
	effectDropShadowWaterMark[L.shadowColor].setValue(RGBH('040404'));
	effectDropShadowWaterMark[L.direction].setValue(135);
	effectDropShadowWaterMark[L.opacity].setValue(255);
	effectDropShadowWaterMark[L.distance].setValue(7);
	effectDropShadowWaterMark[L.softness].setValue(4);
	effectDropShadowWaterMark[L.shadowOnly].setValue(0);


	const layerCounter = CompMain.layers.addText('');
	layerCounter.transform.position.setValue([(40 + 30), I.video.height - (40 + 20 + 40)]);

	const textDocCounter = layerCounter.sourceText.value;
	textDocCounter.resetCharStyle();
	textDocCounter.fontSize = 24;
	textDocCounter.fillColor = RGBH('E0E0E0');
	textDocCounter.font = 'Source Han Mono SC';
	textDocCounter.applyStroke = true;
	textDocCounter.strokeColor = RGBH('E0E0E0');
	textDocCounter.strokeWidth = 2;

	layerCounter.sourceText.setValue(textDocCounter);

	layerCounter.startTime = D.opener + D.title - 0.5;
	layerCounter.duration = D.lines;

	let duration = D.opener + D.title;
	let now = D.lengthLine;

	while(now) {
		layerCounter.sourceText.setValueAtTime(duration, now - 1);
		duration += LinesInfoExtra[D.lengthLine - now--][0] + D.interval;
	}
};

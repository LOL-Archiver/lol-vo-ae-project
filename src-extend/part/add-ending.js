this.AddEnding = () => {
	const textThankyou = '感谢观看！';
	const textInfo = I.textInfo;


	const scaleBackground = I.video.landscape ? 158 : 268;


	const footageBackground = GetFootage(EvalString(I.file.background));
	const isVideoBackground = (footageBackground.file.name.match(/\.mp4$/) || []).length > 0;


	const layerBackground = CompMain.layers.add(footageBackground, D.full);
	layerBackground.startTime = D.linesEnd + 2;

	layerBackground.transform.scale.setValue([scaleBackground, scaleBackground]);

	const positionSplashBackground = layerBackground.position.value;
	positionSplashBackground[0] += OffsetSplashBackground;
	layerBackground.position.setValue(positionSplashBackground);

	layerBackground.transform.opacity.setValueAtTime(D.linesEnd + 2, 0);
	layerBackground.transform.opacity.setValueAtTime(D.linesEnd + 3.4, 100);


	if(isVideoBackground) {
		const layerBackground2 = CompMain.layers.add(footageBackground, D.full);
		layerBackground2.startTime = D.linesEnd + 2 + footageBackground.duration;

		layerBackground2.transform.scale.setValue([scaleBackground, scaleBackground]);

		const positionSplashBackground2 = layerBackground2.position.value;
		positionSplashBackground2[0] += OffsetSplashBackground;
		layerBackground2.position.setValue(positionSplashBackground2);

		layerBackground2.transform.opacity.setValueAtTime(D.linesEnd + 2, 0);
		layerBackground2.transform.opacity.setValueAtTime(D.linesEnd + 3.4, 100);
	}



	const layerThankyou = CompMain.layers.addText(textThankyou);

	layerThankyou.startTime = D.linesEnd + 3.4;
	layerThankyou.duration = D.credit;

	layerThankyou.transform.position.setValue([40, 150]);
	layerThankyou.transform.opacity.setValueAtTime(D.linesEnd + 3.4, 0);
	layerThankyou.transform.opacity.setValueAtTime(D.linesEnd + 4.5, 100);

	const textDocThankyou = layerThankyou.sourceText.value;
	textDocThankyou.resetCharStyle();
	textDocThankyou.fontSize = 100;
	textDocThankyou.font = 'Source Han Mono SC';
	textDocThankyou.applyStroke = true;
	textDocThankyou.fillColor = RGBH('FFFAFA');
	textDocThankyou.strokeColor = RGBH('FFFAFA');
	textDocThankyou.strokeWidth = 4;
	layerThankyou.sourceText.setValue(textDocThankyou);

	const effectDropShadowThankyou = layerThankyou.effect.addProperty('ADBE Drop Shadow');
	effectDropShadowThankyou[L.shadowColor].setValue(RGBH('040404'));
	effectDropShadowThankyou[L.direction].setValue(135);
	effectDropShadowThankyou[L.opacity].setValue(255);
	effectDropShadowThankyou[L.distance].setValue(7);
	effectDropShadowThankyou[L.softness].setValue(4);
	effectDropShadowThankyou[L.shadowOnly].setValue(0);


	const layerCredit = CompMain.layers.addText(textInfo);

	layerCredit.startTime = D.linesEnd + 3.4;
	layerCredit.duration = D.credit;

	layerCredit.transform.position.setValue([40, 300]);
	layerCredit.transform.opacity.setValueAtTime(D.linesEnd + 3.4, 0);
	layerCredit.transform.opacity.setValueAtTime(D.linesEnd + 4.5, 100);

	const textDocCredit = layerCredit.sourceText.value;
	textDocCredit.resetCharStyle();
	textDocCredit.fontSize = I.video.size.fontLine;
	textDocCredit.font = 'Source Han Mono SC';
	textDocCredit.applyStroke = true;
	textDocCredit.fillColor = RGBH('FFFAFA');
	textDocCredit.strokeColor = RGBH('FFFAFA');
	textDocCredit.strokeWidth = 1;
	layerCredit.sourceText.setValue(textDocCredit);

	const effectDropShadowCredit = layerCredit.effect.addProperty('ADBE Drop Shadow');
	effectDropShadowCredit[L.shadowColor].setValue(RGBH('040404'));
	effectDropShadowCredit[L.direction].setValue(135);
	effectDropShadowCredit[L.opacity].setValue(255);
	effectDropShadowCredit[L.distance].setValue(7);
	effectDropShadowCredit[L.softness].setValue(4);
	effectDropShadowCredit[L.shadowOnly].setValue(0);
};

const makeTitle = () => {
	const offsetBar = 200;
	const offsetText = 12;
	const offsetTrim = 10;
	const fontSize = 140;

	const fontSizeHalf = fontSize / 2;
	const widthVideoHalf = I.video.width / 2;
	const heightVideoHalf = I.video.height / 2;

	const colorText = RGBH('FFFAFA');
	const colorShadow = RGBH('000000');


	const compTitle = EnsureComp('02-标题', D.title, DirComp);


	const textT = AddText(compTitle.layers, I.title1, 'text-top');
	const maskTextT = AddShape(compTitle.layers, 'mask-text-top');
	const textB = AddText(compTitle.layers, I.title2 + (I.title2Suffix || ''), 'text-bottom');
	const maskTextB = AddShape(compTitle.layers, 'mask-text-bottom');

	// Text Top
	textT.trackMatteType = TrackMatteType.ALPHA;

	const textSourceT = textT.sourceText.value;
	textSourceT.resetCharStyle();
	textSourceT.fontSize = fontSize;
	textSourceT.fillColor = colorText;
	textSourceT.font = 'Source Han Mono SC';
	textSourceT.applyStroke = true;
	textSourceT.strokeColor = colorText;
	textSourceT.strokeWidth = 4;
	textT.sourceText.setValue(textSourceT);

	const rectSourceT = textT.sourceRectAtTime(0, false);
	const widthTextT = rectSourceT.width;

	textT.transform.anchorPoint.setValue([widthTextT, -(fontSizeHalf - offsetText)]);

	textT.transform.position.setValueAtTime(0.7, [widthVideoHalf - offsetTrim, heightVideoHalf - fontSizeHalf - 5]);
	textT.transform.position.setValueAtTime(2, [widthVideoHalf + (widthTextT / 2), heightVideoHalf - fontSizeHalf - 5]);
	SetEase(textT.transform.position, 1, 2, Ease1);

	const dropShadowTextT = AddProperty(textT.effect, 'ADBE Drop Shadow');
	dropShadowTextT[L.shadowColor].setValue(colorShadow);
	dropShadowTextT[L.direction].setValue(135);
	dropShadowTextT[L.opacity].setValue((70 / 100) * 255);
	dropShadowTextT[L.distance].setValue(offsetTrim);
	dropShadowTextT[L.softness].setValue(7);

	// Text Bottom
	textB.trackMatteType = TrackMatteType.ALPHA;

	const textSourceB = textB.sourceText.value;
	textSourceB.resetCharStyle();
	textSourceB.fontSize = fontSize;
	textSourceB.fillColor = colorText;
	textSourceB.font = 'Source Han Mono SC';
	textSourceB.applyStroke = true;
	textSourceB.strokeColor = colorText;
	textSourceB.strokeWidth = 4;
	textB.sourceText.setValue(textSourceB);

	const rectSourceB = textB.sourceRectAtTime(0, false);
	const widthTextB = rectSourceB.width;

	textB.transform.anchorPoint.setValue([0, -(fontSizeHalf - offsetText)]);

	textB.transform.position.setValueAtTime(0.7, [widthVideoHalf + offsetTrim, heightVideoHalf + fontSizeHalf + 5]);
	textB.transform.position.setValueAtTime(2, [widthVideoHalf - (widthTextB / 2), heightVideoHalf + fontSizeHalf + 5]);
	SetEase(textB.transform.position, 1, 2, Ease1);

	const dropShadowTextB = AddProperty(textB.effect, 'ADBE Drop Shadow');
	dropShadowTextB[L.shadowColor].setValue(colorShadow);
	dropShadowTextB[L.direction].setValue(135);
	dropShadowTextB[L.opacity].setValue((70 / 100) * 255);
	dropShadowTextB[L.distance].setValue(offsetTrim);
	dropShadowTextB[L.softness].setValue(7);


	// Mask Text Top
	maskTextT.content.addProperty('ADBE Vector Shape - Rect').size.setValue([I.video.width, I.video.height]);
	maskTextT.content.addProperty('ADBE Vector Graphic - Fill').color.expression = 'comp("00-全局变量").layer("01-台词盒颜色").content("组 1").content("填充 1").color';
	maskTextT.enabled = false;
	maskTextT.transform.anchorPoint.setValue([-widthVideoHalf, 0]);

	maskTextT.transform.position.setValueAtTime(0.7, [widthVideoHalf, heightVideoHalf]);
	maskTextT.transform.position.setValueAtTime(2, [widthVideoHalf - (widthTextT / 2 + offsetTrim), heightVideoHalf]);
	SetEase(maskTextT.transform.position, 1, 2, Ease1);

	// Mask Text Bottom
	maskTextB.content.addProperty('ADBE Vector Shape - Rect').size.setValue([I.video.width, I.video.height]);
	maskTextB.content.addProperty('ADBE Vector Graphic - Fill').color.expression = 'comp("00-全局变量").layer("01-台词盒颜色").content("组 1").content("填充 1").color';
	maskTextB.enabled = false;
	maskTextB.transform.anchorPoint.setValue([+widthVideoHalf, 0]);

	maskTextB.transform.position.setValueAtTime(0.7, [widthVideoHalf, heightVideoHalf]);
	maskTextB.transform.position.setValueAtTime(2, [widthVideoHalf + (widthTextB / 2 + offsetTrim), heightVideoHalf]);
	SetEase(maskTextB.transform.position, 1, 2, Ease1);


	const widthTextMax = Math.max(widthTextT, widthTextB);


	const shapeBar = AddShape(compTitle.layers, 'shape-bars');

	const barT = AddProperty(shapeBar.content, 'ADBE Vector Group', 'bar-top');
	AddProperty(barT.content, 'ADBE Vector Shape - Rect').size.setValue([10, fontSize]);
	AddProperty(barT.content, 'ADBE Vector Graphic - Fill').color.expression = 'comp("00-全局变量").layer("01-台词盒颜色").content("组 1").content("填充 1").color';

	barT.transform.anchorPoint.setValue([0, fontSizeHalf]);
	barT.transform.scale.setValueAtTime(0, [100, 0]);
	barT.transform.scale.setValueAtTime(1, [100, 100]);
	SetEase(barT.transform.scale, 1, 2, Ease1);
	barT.transform.rotation.setValueAtTime(0, -270);
	barT.transform.rotation.setValueAtTime(1, 0);
	SetEase(barT.transform.rotation, 1, 2, Ease1);
	barT.transform.position.setValueAtTime(0.7, [0, 0]);
	barT.transform.position.setValueAtTime(2, [-(widthTextMax / 2 + offsetBar), 0]);
	SetEase(barT.transform.position, 1, 2, Ease1);


	const barB = AddProperty(shapeBar.content, 'ADBE Vector Group', 'bar-bottom');
	barB.content.addProperty('ADBE Vector Shape - Rect').size.setValue([10, fontSize]);
	barB.content.addProperty('ADBE Vector Graphic - Fill').color.expression = 'comp("00-全局变量").layer("01-台词盒颜色").content("组 1").content("填充 1").color';

	barB.transform.anchorPoint.setValue([0, -fontSizeHalf]);
	barB.transform.scale.setValueAtTime(0, [100, 0]);
	barB.transform.scale.setValueAtTime(1, [100, 100]);
	SetEase(barB.transform.scale, 1, 2, Ease1);
	barB.transform.rotation.setValueAtTime(0, -270);
	barB.transform.rotation.setValueAtTime(1, 0);
	SetEase(barB.transform.rotation, 1, 2, Ease1);
	barB.transform.position.setValueAtTime(0.7, [0, 0]);
	barB.transform.position.setValueAtTime(2, [+(widthTextMax / 2 + offsetBar), 0]);
	SetEase(barB.transform.position, 1, 2, Ease1);


	return [compTitle, widthTextMax / 2, fontSize, offsetBar];
};

this.AddTitle = () => {
	const [compTitle, widthTextMaxHalf, fontSize, offsetBar] = makeTitle();
	const scaleTitle = 70;
	const offsetTitleTop = Math.max(offsetBar, I.video.width * 0.05);
	const offsetTitleLeft = Math.max(offsetBar, I.video.height * 0.05);

	// compTitle.addGuide(0, I.video.height / 2);
	// compTitle.addGuide(1, I.video.width / 2);
	// compTitle.openInViewer().views[0].options.guidesVisibility = true;

	const layerTitle = CompMain.layers.add(compTitle, D.title);
	layerTitle.startTime = 4;
	layerTitle.scale.setValue([scaleTitle, scaleTitle]);
	layerTitle.position.setValue([widthTextMaxHalf * (scaleTitle / 100) + offsetTitleTop, fontSize * (scaleTitle / 100) + offsetTitleLeft]);


	layerTitle.copyToComp(CompMain);
	const layerTitleR = CompMain.layer(1);
	layerTitleR.stretch = -100;
	layerTitleR.startTime = 4 + D.title * 2;
};

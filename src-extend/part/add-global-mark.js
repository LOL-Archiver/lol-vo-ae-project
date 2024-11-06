this.AddGlobalMark = () => {
	for(const markGlobal of I.marksGlobal) {
		const layerMarkGlobal = CompMain.layers.addText('');
		layerMarkGlobal.transform.position.setValue([(40 + 30 + 60), I.heightVideo - (40 + 20 + 40)]);

		SetText(layerMarkGlobal, {
			fillColor: RGBH('E0E0E0'),
			font: 'Source Han Mono SC',
			fontSize: 26,
			strokeColor: RGBH('E0E0E0'),
			strokeWidth: 2,
			leading: 24 + 6,
			text: markGlobal.text,
		});


		layerMarkGlobal.startTime = D.opener + D.title + markGlobal.born;
		layerMarkGlobal.duration = markGlobal.duration == -1 ? D.lines : markGlobal.duration;
	}
};

this.AddBackGround = () => {
	const startBackgroundMiddle = 8;
	const scaleBackground = I.landscape ? 158 : 268;


	/** @type {FootageItem} */
	const footageBackground = GetFootage(I.fileBackground, DirFootage);
	const isVideoBackground = (footageBackground.file.name.match(/\.mp4$/) || []).length > 0;



	const layerBackground = CompMain.layers.add(footageBackground, D.full);
	layerBackground.startTime = D.opener - 1;
	layerBackground.scale.setValueAtTime(D.opener - 1, [scaleBackground * 1.5, scaleBackground * 1.5]);
	layerBackground.scale.setValueAtTime(D.opener + 2, [scaleBackground, scaleBackground]);

	const positionSplashBackground = layerBackground.position.value;
	positionSplashBackground[0] += OffsetSplashBackground;
	layerBackground.position.setValue(positionSplashBackground);

	const blurSplashBackground = layerBackground.effect.addProperty('ADBE Box Blur2');
	/** @type {Property} */
	const propertyRadiusBlurSplashBackground = blurSplashBackground[L.blurRadius];
	propertyRadiusBlurSplashBackground.setValueAtTime(5, 0);
	propertyRadiusBlurSplashBackground.setValueAtTime(9, 7);

	if(isVideoBackground && footageBackground.duration <= (startBackgroundMiddle - layerBackground.startTime)) {
		const layerBackground2 = CompMain.layers.add(footageBackground, D.full);
		layerBackground2.startTime = layerBackground.startTime + footageBackground.duration;
		layerBackground2.scale.setValue([scaleBackground, scaleBackground]);

		const positionSplashBackground2 = layerBackground2.position.value;
		positionSplashBackground2[0] += OffsetSplashBackground;
		layerBackground2.position.setValue(positionSplashBackground2);

		const blurSplashBackground2 = layerBackground2.effect.addProperty('ADBE Box Blur2');
		blurSplashBackground2[L.blurRadius].setValue(propertyRadiusBlurSplashBackground.valueAtTime(9, false));
	}


	if(I.fileBackgroundMain) {
		const footageBackgroundMain = GetFootage(I.fileBackgroundMain, DirFootage);
		const isVideoBackgroundMain = (footageBackgroundMain.file.name.match(/\.mp4$/) || []).length > 0;


		const layerBackgroundMain = CompMain.layers.add(footageBackgroundMain, D.full);

		layerBackgroundMain.startTime = startBackgroundMiddle;
		layerBackgroundMain.scale.setValue([scaleBackground, scaleBackground]);

		layerBackgroundMain.transform.opacity.setValueAtTime(8, 0);
		layerBackgroundMain.transform.opacity.setValueAtTime(8 + 2, 100);


		if(isVideoBackgroundMain) {
			const timesLoop = Math.ceil((D.full - 8) / (footageBackgroundMain.duration - 0)) - 1;

			for(let times = 0; times < timesLoop; times++) {
				const layerBackgroundMainVideo = CompMain.layers.add(footageBackgroundMain, D.full);

				const timeStart = 8 + (footageBackgroundMain.duration - 0) * (times + 1);
				layerBackgroundMainVideo.startTime = timeStart;
				layerBackgroundMainVideo.scale.setValue([scaleBackground, scaleBackground]);
			}
		}
	}
};

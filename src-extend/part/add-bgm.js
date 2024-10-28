this.AddBGM = () => {
	if(I.video.mute) { return; }

	const footage = GetFootage(I.file.bgm);

	const countLoop = Math.ceil((D.full / footage.duration));

	for(let i = 1; i <= countLoop; i++) {
		const layerBGM = CompMain.layers.add(footage);

		layerBGM.audio.audioLevels.setValue([-11, -11]);
		layerBGM.startTime = footage.duration * (i - 1);

		if(i == countLoop) {
			layerBGM.audio.audioLevels.setValueAtTime(D.full - 4, [-11, -11]);
			layerBGM.audio.audioLevels.setValueAtTime(D.full, [-45, -45]);
		}
	}
};

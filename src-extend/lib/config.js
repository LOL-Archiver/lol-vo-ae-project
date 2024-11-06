/** @type {FinalProjectInfo} */
this.I = JSON.parse(ReadFile(PATH_INFO));


if(!I.landscape) {
	I.sizeFontMark = I.sizeFontLine - 8;
	I.paddingMark = I.sizeFontLine - 8;
}



/** @type {DurationOrCount} */
this.D = {
	interval: I.durationInterval,
	opener: I.durationOpener,
	ending: I.durationEnding,
	title: I.durationTitle,
};



/** @type {[Duration, number][]} */
this.LinesInfoExtra = [];

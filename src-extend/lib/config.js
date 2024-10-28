/** @type {VideoInfo} */
this.I = JSON.parse(ReadFile(PATH_INFO));


if(!I.video.landscape) {
	I.video.size.fontMark = I.video.size.fontLine - 8;
	I.video.size.paddingMark = I.video.size.fontLine - 8;
}



/** @type {DurationOrCount} */
this.D = {
	interval: I.video.duration.interval,
	opener: I.video.duration.opener,
	ending: I.video.duration.ending,
	title: I.video.duration.title,
};



/** @type {[Duration, number][]} */
this.LinesInfoExtra = [];

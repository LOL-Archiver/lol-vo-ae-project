// 主原画的偏移
const offsetSplashBackground = I.infosSplashesOpener.shift().offset;
this.OffsetSplashBackground = I.video.landscape ? 0 : offsetSplashBackground;


/**
 * 添加片头
 * @returns {[CompItem, number]} [片头合成, 背景立绘偏移]
 */
this.AddOpener = () => {
	const compOpener = EnsureComp('01.0-片头', D.opener, DirComp);
	const layerOpener = compOpener.layers;


	const widthGrid = I.video.width / 3;
	const heightGrid2 = I.video.height / 2;
	const heightGrid3 = I.video.height / 3;
	const wGrid = (grid, offset) => widthGrid * (grid - 1 + (offset || 0));
	const hGrid2 = (grid, offset) => heightGrid2 * (grid - 1 + (offset || 0));
	const hGrid3 = (grid, offset) => heightGrid3 * (grid - 1 + (offset || 0));


	const widthSplash = 1215;
	const heightSplash = 717;

	const scaleSplash2 = (heightGrid2 / heightSplash) * 100;
	const scaleSplash3 = (I.video.landscape ? widthGrid / widthSplash : heightGrid3 / heightSplash) * 100;


	// splash-opener-tl
	const compTL = EnsureComp('01.1-片头左上', D.opener, DirComp, widthGrid, heightGrid2);
	layerOpener.add(compTL, D.opener).position.setValue([wGrid(1, 0.5), hGrid2(1, 0.5)]);

	const infoTL = I.infosSplashesOpener[1];
	const splashTL = compTL.layers.add(GetFootage(infoTL.file, DirFootage), D.opener); splashTL.name = 'splash-opener-tl';
	splashTL.scale.setValue([scaleSplash2, scaleSplash2]);

	splashTL.position.setValueAtTime(0, [wGrid(1, 0.5), hGrid2(2, 0.5)]);
	splashTL.position.setValueAtTime(1, [wGrid(1, 0.5), hGrid2(1, 0.5)]);
	SetEase(splashTL.position, 1, 2, Ease1);
	splashTL.position.setValueAtTime(3, [wGrid(1, 0.5), hGrid2(1, 0.5)]);
	splashTL.position.setValueAtTime(4, [wGrid(1, 0.5), hGrid2(2, 0.5)]);
	SetEase(splashTL.position, 3, 4, Ease1);

	// splash-opener-bl
	const compBL = EnsureComp('01.2-片头左下', D.opener, DirComp, widthGrid, heightGrid2);
	layerOpener.add(compBL, D.opener).position.setValue([wGrid(1, 0.5), hGrid2(2, 0.5)]);

	const infoBL = I.infosSplashesOpener[2];
	const splashBL = compBL.layers.add(GetFootage(infoBL.file, DirFootage), D.opener); splashBL.name = 'splash-opener-bl';
	splashBL.scale.setValue([scaleSplash2, scaleSplash2]);

	const xBL = splashBL.position.value[0] + (I.video.landscape ? 0 : infoBL.offset);
	splashBL.position.setValueAtTime(0, [xBL, hGrid2(0, 0.5)]);
	splashBL.position.setValueAtTime(1, [xBL, hGrid2(1, 0.5)]);
	SetEase(splashBL.position, 1, 2, Ease1);
	splashBL.position.setValueAtTime(3, [xBL, hGrid2(1, 0.5)]);
	splashBL.position.setValueAtTime(4, [xBL, hGrid2(0, 0.5)]);
	SetEase(splashBL.position, 3, 4, Ease1);


	// splash-opener-tr
	const compTR = EnsureComp('01.3-片头右上', D.opener, DirComp, widthGrid, heightGrid2);
	layerOpener.add(compTR, D.opener).position.setValue([wGrid(3, 0.5), hGrid2(1, 0.5)]);

	const infoTR = I.infosSplashesOpener[3];
	const splashTR = compTR.layers.add(GetFootage(infoTR.file, DirFootage), D.opener); splashTR.name = 'splash-opener-tr';
	splashTR.scale.setValue([scaleSplash2, scaleSplash2]);

	const xTR = splashTR.position.value[0] + (I.video.landscape ? 0 : infoTR.offset);
	splashTR.position.setValueAtTime(0, [xTR, hGrid2(2, 0.5)]);
	splashTR.position.setValueAtTime(1, [xTR, hGrid2(1, 0.5)]);
	SetEase(splashTR.position, 1, 2, Ease1);
	splashTR.position.setValueAtTime(3, [xTR, hGrid2(1, 0.5)]);
	splashTR.position.setValueAtTime(4, [xTR, hGrid2(2, 0.5)]);
	SetEase(splashTR.position, 3, 4, Ease1);

	// splash-opener-br
	const compBR = EnsureComp('01.4-片头右下', D.opener, DirComp, widthGrid, heightGrid2);
	layerOpener.add(compBR, D.opener).position.setValue([wGrid(3, 0.5), hGrid2(2, 0.5)]);

	const infoBR = I.infosSplashesOpener[4];
	const splashBR = compBR.layers.add(GetFootage(infoBR.file, DirFootage), D.opener); splashBR.name = 'splash-opener-br';
	splashBR.scale.setValue([scaleSplash2, scaleSplash2]);

	const xBR = splashBR.position.value[0] + (I.video.landscape ? 0 : infoBR.offset);
	splashBR.position.setValueAtTime(0, [xBR, hGrid2(0, 0.5)]);
	splashBR.position.setValueAtTime(1, [xBR, hGrid2(1, 0.5)]);
	SetEase(splashBR.position, 1, 2, Ease1);
	splashBR.position.setValueAtTime(3, [xBR, hGrid2(1, 0.5)]);
	splashBR.position.setValueAtTime(4, [xBR, hGrid2(0, 0.5)]);
	SetEase(splashBR.position, 3, 4, Ease1);


	// splash-opener-tc
	const compTC = EnsureComp('01.5-片头中上', D.opener, DirComp, widthGrid, heightGrid3);
	const avCompTC = layerOpener.add(compTC, D.opener);
	avCompTC.position.setValueAtTime(0, [wGrid(2, 0.5), hGrid3(1.5, 0.5)]);
	avCompTC.position.setValueAtTime(1, [wGrid(2, 0.5), hGrid3(1, 0.5)]);
	SetEase(avCompTC.position, 1, 2, Ease1);
	avCompTC.position.setValueAtTime(3, [wGrid(2, 0.5), hGrid3(1, 0.5)]);
	avCompTC.position.setValueAtTime(4, [wGrid(2, 0.5), hGrid3(1.5, 0.5)]);
	SetEase(avCompTC.position, 3, 4, Ease1);

	const infoTC = I.infosSplashesOpener[5];
	const splashTC = compTC.layers.add(GetFootage(infoTC.file, DirFootage), D.opener); splashTC.name = 'splash-opener-tc';
	splashTC.scale.setValue([scaleSplash3, scaleSplash3]);

	const xTC = splashTC.position.value[0] + (I.video.landscape ? 0 : infoTC.offset);
	splashTC.position.setValueAtTime(0, [xTC, hGrid3(2, 0.5)]);
	splashTC.position.setValueAtTime(1, [xTC, hGrid3(1, 0.5)]);
	SetEase(splashTC.position, 1, 2, Ease1);
	splashTC.position.setValueAtTime(3, [xTC, hGrid3(1, 0.5)]);
	splashTC.position.setValueAtTime(4, [xTC, hGrid3(2, 0.5)]);
	SetEase(splashTC.position, 3, 4, Ease1);


	// splash-opener-bc
	const compBC = EnsureComp('01.6-片头中下', D.opener, DirComp, widthGrid, heightGrid3);
	const avCompBC = layerOpener.add(compBC, D.opener);
	avCompBC.position.setValueAtTime(0, [wGrid(2, 0.5), hGrid3(2.5, 0.5)]);
	avCompBC.position.setValueAtTime(1, [wGrid(2, 0.5), hGrid3(3, 0.5)]);
	SetEase(avCompBC.position, 1, 2, Ease1);
	avCompBC.position.setValueAtTime(3, [wGrid(2, 0.5), hGrid3(3, 0.5)]);
	avCompBC.position.setValueAtTime(4, [wGrid(2, 0.5), hGrid3(2.5, 0.5)]);
	SetEase(avCompBC.position, 3, 4, Ease1);

	const infoBC = I.infosSplashesOpener[6];
	const splashBC = compBC.layers.add(GetFootage(infoBC.file, DirFootage), D.opener); splashBC.name = 'splash-opener-bc';
	splashBC.scale.setValue([scaleSplash3, scaleSplash3]);

	const xBC = splashBC.position.value[0] + (I.video.landscape ? 0 : infoBC.offset);
	splashBC.position.setValueAtTime(0, [xBC, hGrid3(0, 0.5)]);
	splashBC.position.setValueAtTime(1, [xBC, hGrid3(1, 0.5)]);
	SetEase(splashBC.position, 1, 2, Ease1);
	splashBC.position.setValueAtTime(3, [xBC, hGrid3(1, 0.5)]);
	splashBC.position.setValueAtTime(4, [xBC, hGrid3(0, 0.5)]);
	SetEase(splashBC.position, 3, 4, Ease1);


	// splash-opener-mc
	const compMC = EnsureComp('01.7-片头正中', D.opener, DirComp, widthGrid, heightGrid3);
	const avCompMC = layerOpener.add(compMC, D.opener);
	avCompMC.position.setValue([wGrid(2, 0.5), hGrid3(2, 0.5)]);

	avCompMC.scale.setValueAtTime(0, [100, 0]);
	avCompMC.scale.setValueAtTime(1, [100, 100]);
	SetEase(avCompMC.scale, 1, 2, Ease1);
	avCompMC.scale.setValueAtTime(3, [100, 100]);
	avCompMC.scale.setValueAtTime(4, [100, 0]);
	SetEase(avCompMC.scale, 3, 4, Ease1);

	const infoMC = I.infosSplashesOpener[0];
	const splashMC = compMC.layers.add(GetFootage(infoMC.file, DirFootage), D.opener); splashMC.name = 'splash-opener-mc';
	splashMC.scale.setValue([scaleSplash3, scaleSplash3]);

	const xMC = splashMC.position.value[0] + (I.video.landscape ? 0 : infoMC.offset);
	splashMC.position.setValue([xMC, hGrid3(1, 0.5)]);


	// mask-opener
	const maskMC = layerOpener.addSolid(RGBH('2D2D2D'), 'mask-opener', I.video.width, I.video.height, 1);
	maskMC.startTime = 0;
	maskMC.outPoint = 5;
	maskMC.adjustmentLayer = true;

	maskMC.opacity.setValueAtTime(0, 0);
	maskMC.opacity.setValueAtTime(1, 100);
	SetEase(maskMC.opacity, 1, 2, Ease1);
	maskMC.opacity.setValueAtTime(3, 100);
	maskMC.opacity.setValueAtTime(4, 0);
	SetEase(maskMC.opacity, 3, 4, Ease1);

	const blurLogoMask = maskMC.effect.addProperty('ADBE Box Blur2');
	blurLogoMask[L.blurRadius].setValue(7);


	// logo-font
	const logoFont = layerOpener.add(GetFootage(`${I.dir.reso}/other/logo.png`, DirFootage), 6); logoFont.name = 'logo-font';
	logoFont.startTime = 0;
	logoFont.outPoint = 5;
	logoFont.scale.setValue([50, 50]);

	logoFont.opacity.setValueAtTime(0, 0);
	logoFont.opacity.setValueAtTime(1, 100);
	SetEase(logoFont.opacity, 1, 2, Ease2);
	logoFont.opacity.setValueAtTime(3, 100);
	logoFont.opacity.setValueAtTime(4, 0);
	SetEase(logoFont.opacity, 3, 4, Ease1);


	// logo-image
	const logoImage = layerOpener.add(GetFootage(`${I.dir.reso}/other/jugong480-500.mp4`, DirFootage), 6); logoImage.name = 'logo-image';
	logoImage.startTime = 0;
	logoImage.outPoint = 5;
	logoImage.scale.setValue([40, 40]);
	logoImage.position.setValue([I.video.width / 2 - 240, I.video.height / 2]);

	logoImage.opacity.setValueAtTime(0, 0);
	logoImage.opacity.setValueAtTime(1, 100);
	SetEase(logoImage.opacity, 1, 2, Ease2);
	logoImage.opacity.setValueAtTime(3, 100);
	logoImage.opacity.setValueAtTime(4, 0);
	SetEase(logoImage.opacity, 3, 4, Ease1);

	const colorKeyLogoImage = logoImage.effect.addProperty('ADBE Color Key');
	colorKeyLogoImage[L.keyColor].setValue(RGBH('FFFFFF'));
	colorKeyLogoImage[L.colorTolerance].setValue(64);


	return compOpener;
};

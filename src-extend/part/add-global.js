/**
 * 添加全局变量
 * @returns {CompItem} 全局变量合成
 */
this.AddGlobal = () => {
	const compGlobal = EnsureComp('00-全局变量', D.opener, DirComp);


	const layerColorBoxLine = compGlobal.layers.addShape();
	layerColorBoxLine.name = '01-台词盒颜色';

	SetAttr(layerColorBoxLine.transform, {
		position: [120, 120],
	});

	/** @type {PropertyGroup} */
	const boxColorBoxLine = AddProperty(layerColorBoxLine.content, 'ADBE Vector Group');
	SetAttr(AddProperty(boxColorBoxLine.content, 'ADBE Vector Shape - Rect'), {
		size: [160, 160],
		roundness: 14,
	});
	SetAttr(AddProperty(boxColorBoxLine.content, 'ADBE Vector Graphic - Fill'), {
		color: RGBH(I.color || '1FAAF1'),
	});



	compGlobal.openInViewer();


	return compGlobal;
};

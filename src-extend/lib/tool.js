// @include './paths.js';
// @include '../src-extend/lib/json2.js';


/**
 * 读取文件
 * @param {string} path 文件路径
 * @param {string} encoding 文件编码
 * @returns {string} 文件内容
 */
this.ReadFile = (path, encoding = 'UTF8') => {
	const file = new File(path);

	if(encoding) { file.encoding = encoding; }

	try {
		file.open('r');

		return file.read();
	}
	finally {
		file.close();
	}
};



/**
 * 遍历项目的子项目
 * @param {Item} Item 项目
 * @param {Function} callback 回调函数
 */
this.Each = (target, callback) => {
	// if(!(target instanceof Project) && !(target instanceof FolderItem)) { throw '目标不能遍历'; }
	if(!(callback instanceof Function)) { throw '回调函数不是函数'; }

	const items = [];

	for(let i = 1; i <= target.numItems; i++) {
		items.push(target.item(i));
	}

	for(let i = 0; i < items.length; i++) {
		callback(items[i], i);
	}
};

/**
 * 确保`素材目录`存在
 * @param {string} name 目录名
 * @param {FolderItem} parent 父目录
 * @returns
 */
this.EnsureDir = (name, parent) => {
	let dir;


	Each(parent, item => (item instanceof FolderItem && name == item.name) && (dir = item));


	return dir ?? parent.items.addFolder(name);
};

/**
 * 确保`合成项目`存在
 * @param {string} name 目录名
 * @param {Duration} duration 持续时间
 * @param {FolderItem} parent 父目录
 * @param {number} widthVideo 视频宽度
 * @param {number} heightVideo 视频高度
 * @returns {CompItem} 合成项目
 */
this.EnsureComp = (name, duration, parent, widthVideo = I.widthVideo, heightVideo = I.heightVideo) => {
	let comp;


	Each(parent, item => (item instanceof CompItem && name == item.name) && (comp = item));


	if(!comp) {
		comp = parent.items.addComp(name, widthVideo, heightVideo, I.pixelAspect, duration, I.frameRate);
		comp.bgColor = RGBH('2D2D2D');
	}


	return comp;
};


/**
 * 将RGB数值转换为RGB比例数组
 * @param {number} r 红
 * @param {number} g 绿
 * @param {number} b 蓝
 * @returns
 */
this.RGB = (r, g, b) => [(r / 255).toFixed(4), (g / 255).toFixed(4), (b / 255).toFixed(4)];

/**
 * 将RGB文本转换为RGB数组
 * @param {string} rgb RGB文本
 * @returns
 */
this.RGBH = (rgb_) => {
	const rgb = rgb_.replace(/^#/, '');

	const [rh, rl, gh, gl, bh, bl] = rgb;

	return RGB(Number(`0x${rh}${rl}`), Number(`0x${gh}${gl}`), Number(`0x${bh}${bl}`));
};


this.Ease1 = new KeyframeEase(0, 75);
this.Ease2 = new KeyframeEase(0, 100);
this.SetEase = (propertySpec, key1, key2, ease) => {
	const length = propertySpec.keyInTemporalEase(key1).length;
	const eases = length == 2 ? [ease, ease] : (length == 3 ? [ease, ease, ease] : [ease]);

	propertySpec.setTemporalEaseAtKey(key1, propertySpec.keyInTemporalEase(key1), eases);
	propertySpec.setTemporalEaseAtKey(key2, eases, propertySpec.keyOutTemporalEase(key2));
};


this.AddProperty = (group, name, nameProp) => {
	const property = group.addProperty(name);

	if(typeof nameProp == 'string') { property.name = nameProp; }

	return property;
};
this.AddShape = (group, nameShape) => {
	const shape = group.addShape();

	if(typeof nameShape == 'string') { shape.name = nameShape; }

	return shape;
};
this.AddText = (group, string, nameText) => {
	const text = group.addText(string);

	if(typeof nameText == 'string') { text.name = nameText; }

	return text;
};



/**
 * @param {LineConfig[]} lines
 * @param {(line: LineConfig, lid: number, index: number) => void} callback
 */
this.EnumLine = (lines, callback) => {
	let index = 0;

	for(let lid = 0; lid < lines.length; lid++) {
		const line = lines[lid];

		if(line.duration) {
			callback(line, lid, index++);
		}
	}
};


// eslint-disable-next-line no-useless-escape
const regexSize13 = /[A-Za-z0-9,.!(){}<> …%\\\/'":]/g;
const charsSize13 = ['Ọ̀', 'ẹ'];

/** @param {string} text */
this.GetBoxSize = text => {
	const fontSize = I.sizeFontLine;
	const heightLeading = I.heightLeading;
	const widthMax = 1050;
	const heightMax = 1050;

	const layerLine = CompTest.layers.addBoxText([widthMax, heightMax], text);

	const textDocLine = layerLine.sourceText.value;
	textDocLine.resetCharStyle();
	textDocLine.fontSize = fontSize;
	textDocLine.font = 'Source Han Mono SC';
	textDocLine.applyStroke = true;
	textDocLine.strokeWidth = 2;
	textDocLine.text = text;
	textDocLine.name = 'Test';
	textDocLine.leading = fontSize + heightLeading;
	layerLine.sourceText.setValue(textDocLine);


	// const lengthsLine = [];
	// const lines = text.split('\n');
	// for(let i = 0; i < lines.length; i++) {
	// 	lengthsLine.push(lines[i].length);
	// }

	// const lengthMaxLine = Math.max.apply(this, lengthsLine);

	// const widthLineText = lengthMaxLine * (text == '(.......)' ? Math.ceil(fontSize * 2 / 3) : fontSize);

	// const rect = layerLine.sourceRectAtTime(0, false);

	// // const widthBox = Math.ceil(rect.width) + fontSize;
	// const lineBox = Math.round((rect.height - fontSize) / (fontSize + heightLeading)) + 1;

	// layerLine.remove();

	// return [Math.min(widthLineText, widthMax), lineBox * (fontSize + heightLeading) - heightLeading, lineBox];


	const widthsRow = [];
	const lines = text.split('\n');
	for(let i = 0; i < lines.length; i++) {
		const line = lines[i];

		let countCharSize13 = 0;
		for(const c of charsSize13) { countCharSize13 += line.indexOf(c) > -1; }

		const countSize13 = (line.match(regexSize13) || []).length + countCharSize13;

		const widthRow = lines[i].length * fontSize - countSize13 * Math.ceil(fontSize * 1 / 3 - 1);

		widthsRow.push(widthRow);
	}

	const widthRowMax = Math.max.apply(this, widthsRow);


	const rect = layerLine.sourceRectAtTime(0, false);
	const countRowBox = Math.round((rect.height - fontSize) / (fontSize + heightLeading)) + 1;


	return [
		Math.min(widthRowMax, widthMax),
		countRowBox * (fontSize + heightLeading) - heightLeading,
		countRowBox,
	];
};

// const rrr1 = GetBoxSize('你不好好');
// $.writeln('你不好好 ' + rrr1[0]);
// const rrr2 = GetBoxSize('测试文字');
// $.writeln('测试文字 ' + rrr2[0]);
// const rrr3 = GetBoxSize('“可以”');
// $.writeln('“可以” ' + rrr3[0]);


this.GetBoxSizeMark = text => {
	const fontSize = I.sizeFontMark;
	const heightLeading = I.heightLeading;
	const widthMax = 1200;
	const heightMax = 1050;

	const layerMark = CompTest.layers.addBoxText([widthMax, heightMax], text);

	const textDocMark = layerMark.sourceText.value;
	textDocMark.resetCharStyle();
	textDocMark.fontSize = fontSize;
	textDocMark.font = 'Source Han Mono SC';
	textDocMark.applyStroke = true;
	textDocMark.strokeWidth = 1;
	textDocMark.text = text;
	textDocMark.name = 'TestMark';
	textDocMark.leading = fontSize + heightLeading;
	layerMark.sourceText.setValue(textDocMark);


	const widthsRow = [];
	const lines = text.split('\n');
	for(let i = 0; i < lines.length; i++) {
		const line = lines[i];

		let countCharSize13 = 0;
		for(const c of charsSize13) { countCharSize13 += line.indexOf(c) > -1; }

		const countSize13 = (line.match(regexSize13) || []).length + countCharSize13;

		const widthRow = lines[i].length * fontSize - countSize13 * Math.ceil(fontSize * 1 / 3 - 1);

		widthsRow.push(widthRow);
	}

	const widthRowMax = Math.max.apply(this, widthsRow);


	const rect = layerMark.sourceRectAtTime(0, false);
	const countRowBox = Math.round((rect.height - fontSize) / (fontSize + heightLeading)) + 1;


	return [
		Math.min(widthRowMax, widthMax),
		countRowBox * (fontSize + heightLeading) - heightLeading,
		countRowBox,
	];
};


/**
 * 设置文本
 * @param {TextLayer} target 目标文本层
 * @param {Object} options 新文本选项
 * @returns {TextLayer} 目标文本层
 */
this.SetText = (target, options) => {
	if(!(target instanceof TextLayer)) { throw '目标不是文本层'; }


	const textDoc = target.property('ADBE Text Properties').property('ADBE Text Document').value;

	textDoc.resetCharStyle();


	let hasOptionStroke = false;
	for(const key in options) {
		if(key.indexOf('stroke') > -1) { hasOptionStroke = true; }
	}
	if(hasOptionStroke) { textDoc.applyStroke = true; }


	for(const key in options) {
		textDoc[key] = options[key];
	}

	target.sourceText.setValue(textDoc);


	if('justification' in options && options.justification != ParagraphJustification.RIGHT_JUSTIFY) {
		textDoc.justification = ParagraphJustification.RIGHT_JUSTIFY;
	}


	return target;
};


/**
 * 设置属性
 * @param {*} target 目标文本层
 * @param {Object} options 新文本选项
 * @returns {*} 目标文本层
 */
this.SetAttr = (target, options) => {
	for(const key in options) {
		target[key].setValue(options[key]);
	}

	return target;
};

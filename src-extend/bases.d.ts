/// <reference types="types-for-adobe/AfterEffects/22.0"/>


/** 整数 */
type Integer = number
/** 持续时间 */
type Duration = number
/** 目录路径 */
type DirectoryPath = string
/** 文件路径 */
type FilePath = string


/** 对话配置 */
type DialogConfig = {

}

/** 额外视频项目配置（用于指定附加插槽的项目） */
type ExtraProjectConfig = {
	/** 台词文件 */
	readonly fileDictation: string;
	/** 底台词 */
	readonly lineAssign: LineConfig;
};
/** 视频项目配置 */
type ProjectConfig = {
	/** 标题1 */
	readonly title1?: string;
	/** 标题2 */
	readonly title2?: string;
	/** 标题2后缀 */
	readonly title2Suffix?: string;

	/** 主题色 */
	readonly color?: string;

	/** 英雄ID（如果有） */
	readonly idChampion?: string;
	/** 皮肤ID（如果有） */
	readonly idSkin?: string;

	/** 主头像 */
	readonly fileHead?: string;
	/** 背景 */
	readonly fileBackground?: string;
	/** 背景（正文播放时） */
	readonly fileBackgroundMain?: string;
	/** 台词文件 */
	readonly fileDictation?: string;
	/** 纹理 */
	readonly fileShade?: string;

	/** 语音目录 */
	readonly dirVoice?: string;


	/** 台词匹配覆盖 */
	readonly linesAssign?: { readonly [event: string]: EventConfig; };
	/** 事件匹配覆盖 */
	readonly eventsAssign?: { readonly [event: string]: EventConfig; };

	/** 额外项目配置 */
	readonly extrasProject?: { readonly [event: string]: ExtraProjectConfig; };

	/**
	 * 包含台词ID
	 * - 如果有指定就会只输出指定的台词
	 * - 并且指定输出
	 */
	readonly idsLineIncludes?: string[];
	/**
	 * 排除台词ID
	 * - 即使在idsLineIncludes中指定了也会被排除
	 */
	readonly idsLineExcludes?: string[];


	/** 对话成员 */
	readonly dialogist?: { readonly [nick: string]: string };
	/** 对话组插槽 */
	readonly dialogs: string[];
}



/** 基础视频配置 */
type BaseVideoConfig = {
	/** 视频宽度 */
	readonly width: number;
	/** 视频高度 */
	readonly height: number;
	/**
	 * 视频是否横屏（自动计算）
	 * - 依据：I.video.width > I.video.height
	 */
	readonly landscape: boolean;


	/** 视频像素比例 */
	readonly pixelAspect: number;
	/** 视频帧率 */
	readonly frameRate: number;


	/** 简单工程（用于快速生成工程） */
	readonly simple: boolean;
	/** 不添加音频文件（用于快速生成工程） */
	readonly mute: boolean;
	/** 只添加含有备注的台词（用于快速预览含有备注的台词） */
	readonly onlyMark: boolean;

	/**
	 * 台词范围
	 * @example
	 * [1, 4] // 从第1句开始，从第4句结束
	 */
	readonly range: [
		/** 开始 */
		Integer,
		/** 结束 */
		Integer
	];


	/** 各种持续时间 */
	readonly duration: {
		/** 台词之间的间隔时长 */
		readonly interval: Duration;

		/** 片头时长 */
		readonly opener: Duration;
		/** 片尾时长 */
		readonly ending: Duration;

		/** 标题时长 */
		readonly title: Duration;

		/** 扩展台词（无声）时长 */
		readonly extendLine: Duration;
	};


	/** 各种元素尺寸 */
	readonly size: {
		/** 台词字体大小 */
		readonly fontLine: number;
		/** 条件字体大小 */
		readonly fontCond: number;
		/** 备注字体大小 */
		readonly fontMark: number;

		/** 台词盒填充 */
		readonly paddingLine: number;
		/** 条件盒填充 */
		readonly paddingCond: number;
		/** 备注盒填充 */
		readonly paddingMark: number;

		/** 台词盒顶部填充（因事件盒的重叠而额外增加的） */
		readonly paddingTopExtra$event: number;

		/** 头像盒直径 */
		readonly sizeBoxHeader: number;
		/** 台词字体行距 */
		readonly heightLeading: number;

		/** 台词总成间距 */
		readonly gapLive: number;
		/** 台词总成中台词、条件、备注的间距 */
		readonly gapBoxLive: number;

		/** 台词盒到视频侧边的填充 */
		readonly paddingSideVideo: number;
		/** 台词盒到视频底边的填充 */
		readonly paddingBottomVideo: number;
	};
}

/** 视频配置 */
type VideoConfig = {
	/** 视频的基础参数 */
	readonly video: BaseVideoConfig;


	/** 当前视频与前几期视频的插槽（用于生成片头） */
	readonly slots: string[];


	/**
	 * 英雄或皮肤的完整插槽
	 * - 格式：主插槽.副插槽+附加插槽
	 * @example
	 * "025026" // 至尊魔女 莫甘娜
	 * "103000.2011" // 阿狸（2011旧版）
	 * "498038+497036" // 白星守霞（附加白星守洛的台词）
	 * "497036+498038" // 白星守洛（附加白星守霞的台词）
	 */
	readonly slotFull: string

	/**
	 * 主插槽.副插槽
	 * @example
	 * "498038.2011" <== "498038.2011+497036"
	*/
	readonly slot?: string;
	/**
	 * 主插槽
	 * @example
	 * "498038" <== "498038.2011+497036"
	 */
	readonly slotMain?: string;
	/**
	 * 副插槽
	 * @example
	 * "2011" <== "498038.2011+497036"
	 */
	readonly slotSub?: string;
	/**
	 * 附加插槽
	 * @example
	 * ["497036", "497037"] <== "498038.2011+497036+497037"
	 */
	readonly slotsExtra?: string[];


	/** 英雄ID（如果有） */
	readonly idChampion?: number
	/** 皮肤ID（如果有） */
	readonly idSkin?: number
	/** 皮肤ID（如果有三位数对齐） */
	readonly idSkinPad?: string


	/** 标题1 */
	readonly title1: string
	/** 标题2 */
	readonly title2: string
	/** 标题2后缀 */
	readonly title2Suffix?: string
	/** 主题色 */
	readonly color?: string
	/** 片尾信息 */
	readonly textInfo: string;

	/** 总合成标题 */
	readonly titleComp: string;




	/** 各种路径 */
	readonly dir: {
		/** 语音总目录 */
		readonly voices: DirectoryPath;
		/** 台词总目录 */
		readonly dictation: DirectoryPath;
		/** 基础数据目录 */
		readonly database: DirectoryPath;
		/** 资源目录 */
		readonly reso: DirectoryPath;

		/** 项目资源目录 */
		readonly resoProject: DirectoryPath;
		/** 语音目录 */
		readonly voice: DirectoryPath;

	};
	/** 各种文件 */
	readonly file: {
		/** 背景音乐 */
		readonly bgm: FilePath;
		/** 水印图片 */
		readonly waterMark: FilePath;

		/** 主头像 */
		readonly head: FilePath;
		/** 背景 */
		readonly background: FilePath;
		/** 背景（正文播放时） */
		readonly backgroundMain?: FilePath;
		/** 台词文件 */
		readonly dictation: FilePath;
		/** 纹理 */
		readonly shade?: FilePath;
	};

	/** 台词匹配覆盖 */
	readonly linesAssign$id: { readonly [event: string]: EventConfig; };
	/** 事件匹配覆盖 */
	readonly eventsAssign$event: { readonly [event: string]: EventConfig; };

	/** 额外项目配置 */
	readonly extrasProject: { readonly [event: string]: ExtraProjectConfig; };

	/**
	 * 包含台词ID
	 * - 如果有指定就会只输出指定的台词
	 * - 并且指定输出
	 */
	readonly idsLineIncludes?: string[];
	/**
	 * 排除台词ID
	 * - 即使在idsLineIncludes中指定了也会被排除
	 */
	readonly idsLineExcludes?: string[];


	/** 对话成员 */
	readonly dialogist?: { readonly [nick: string]: string };
	/** 对话组插槽 */
	readonly dialogs: string[];
}

/** 视频信息 */
type VideoInfo = VideoConfig & {
	/** 片头原画素材 */
	readonly infosSplashesOpener: {
		readonly file: string,
		readonly offset: number,
	}[];
	/** 预处理好的台词 */
	readonly lines: FilePath;
}


/** 原始台词额外配置（来源于台词文件的配置） */
type RawLineExtraConfig = {
	/** 类型 */
	readonly type: string;
	/** 参数 */
	readonly params: string[];
}
/** 原始台词配置 */
type RawLineConfig = {
	/** 音频ID（WWise概念） */
	readonly idAudio?: string;
	/** 声音ID（WWise概念） */
	readonly idsSound?: string[];
	/** 额外配置 */
	readonly extras?: RawLineExtraConfig[];

	/** 事件名 */
	readonly event?: string;
	/** 台词文本 */
	readonly line?: string;
}
/** 原始事件 */
type RawEventConfig = {
	/** 事件名 */
	readonly event?: string;
	/** 台词组 */
	readonly lines?: RawLineConfig[];

	/** 目标头像 */
	readonly target?: string;
}


/** 台词配置 */
type LineConfig = {
	/** 音频ID（WWise概念） */
	readonly idAudio?: string;
	/** 声音ID（WWise概念） */
	readonly idsSound?: string[];
	/** 额外配置 */
	readonly extras?: RawLineExtraConfig[];

	/** 事件文本 */
	readonly event: string;
	/** 台词文本 */
	readonly line: string;


	/** 目标头像 */
	readonly target?: string;
}
/** 事件 */
type EventConfig = {
	/** 事件名 */
	readonly event?: string;
	/** 台词组 */
	readonly lines?: LineConfig[];

	/** 目标头像 */
	readonly target?: string;
}


/** 时长汇总配置 */
type DurationOrCount = {
	/** 台词之间的间隔时长 */
	readonly interval: Duration;

	/** 片头时长 */
	readonly opener: Duration;
	/** 片尾时长 */
	readonly ending: Duration;

	/** 标题时长 */
	readonly title: Duration;

	/** 扩展台词（无声）时长 */
	readonly extendLine: Duration;


	/** 实际台词数量 */
	lengthLine: number;

	/** 所有实际台词合计时长 */
	lines: Duration;


	/** 所有实际台词单时长和高 */
	list: [Duration, number][];


	/** 节目总时长 */
	readonly full: Duration;

	/** 所有实际台词结束时长 */
	readonly linesEnd: Duration;
}

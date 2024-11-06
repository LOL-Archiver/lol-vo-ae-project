/// <reference types="types-for-adobe/AfterEffects/22.0"/>


/** 基础路径配置 */
type BasePathConfig = {
	/** 语音总目录（用于在皮肤模式下，匹配对应的语音目录和台词文件） */
	readonly dirVoices: string;
	/** 台词总目录（用于在皮肤模式下，匹配对应的语音目录和台词文件） */
	readonly dirDictations: string;
	/** 资源总目录（用于根据runcom匹配对应的资源目录） */
	readonly dirResourcesurces: string;
	/** 英雄基础信息（用于在皮肤模式下，获取皮肤的相关基础信息） */
	readonly fileChampions: string;
}
/** 素材路径配置 */
type ResourcePathConfig = {
	/** 默认头像文件 */
	readonly fileHead: string;
	/** 默认背景文件 */
	readonly fileBackground: string;
	/** 默认主背景文件 */
	readonly fileBackgroundMain: string;
	/** 默认Logo文件 */
	readonly fileLogo: string;
	/** 默认Logo左侧文件 */
	readonly fileLogoSide: string;

	/** 背景音乐文件 */
	readonly fileBGM: string;
	/** 水印文件 */
	readonly fileWaterMark: string;
}
/** 视频参数配置 */
type VideoConfig = {
	/** 视频宽度 */
	readonly widthVideo: number;
	/** 视频高度 */
	readonly heightVideo: number;

	/** 视频像素比例 */
	readonly pixelAspect: number;
	/** 视频帧率 */
	readonly frameRate: number;


	/** 台词之间的间隔时长 */
	readonly durationInterval: number;
	/** 片头时长 */
	readonly durationOpener: number;
	/** 片尾时长 */
	readonly durationEnding: number;
	/** 标题时长 */
	readonly durationTitle: number;
	/** 扩展台词（无声）时长 */
	readonly durationExtendLine: number;


	/** 台词字体大小 */
	readonly sizeFontLine: number;
	/** 条件字体大小 */
	readonly sizeFontCond: number;
	/** 备注字体大小 */
	readonly sizeFontMark: number;
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


	/**
	 * 视频是否横屏（自动计算）
	 * - 依据：widthVideo>heightVideo
	 */
	readonly landscape: boolean;
}
/** 视频调试配置 */
type VideoDebugConfig = {
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
		number,
		/** 结束 */
		number
	];
}

/** 全局注释配置 */
type GlobalMarkConfig = {
	readonly text: string;
	readonly born: number;
	readonly duration: number;
}

/** 工程配置 */
type ProjectConfig = BasePathConfig & ResourcePathConfig & VideoConfig & VideoDebugConfig & {
	/** 视频参数名 */
	readonly profileVideo: String;
	/** 视频参数集，`$`是默认集 */
	readonly profilesVideo: {
		readonly [key: string]: VideoConfig;
	};


	/** 台词文件 */
	readonly fileDictation: string;
	/** 语音目录 */
	readonly dirVoice: string;


	/** 颜色 */
	readonly color: string;
	/** 主标题 */
	readonly title1: string;
	/** 副标题 */
	readonly title2: string;
	/** 副标题后缀 */
	readonly title2Suffix: string;
	/** 片尾文本 */
	readonly textEnding: string;


	/** 指定台词ID，留空不启动 */
	readonly idsLineInclude: string[];
	/** 排除台词ID，优先级高于包含ID */
	readonly idsLineExclude: string[];


	/** 扩展配置 */
	readonly configsExtra: {
		readonly [slotExtra: string]: {
			/** 台词文件 */
			readonly fileDictation: string;
			/** 语音目录 */
			readonly dirVoice: string;
		};
	};
	/** 手动追加的台词 */
	readonly linesExtra: DictationLineConfig[];


	/** 事件匹配覆盖 */
	readonly lines$event: { readonly [event: string]: LineConfig; };
	/** 角色匹配覆盖 */
	readonly lines$who: { readonly [event: string]: LineConfig; };
	/** 台词ID匹配覆盖 */
	readonly lines$id: { readonly [event: string]: LineConfig; };


	/** 对话成员 */
	readonly dialogists: { readonly [slot: string]: string; };
	/** 对话指令条集 */
	readonly dialogs: string[];


	/** 全局注释 */
	readonly marksGlobal: GlobalMarkConfig[];
};


/** 命令条配置 */
type RuncomConfig = {
	/** 命令条（数组，包含过去的命令条，片头有用） */
	readonly runcoms: string[];


	/** 工程模式 */
	readonly mode: 'cs' | 'sp';

	/**
	 * 英雄或皮肤的完整插槽
	 * - 格式：主插槽.副插槽+附加插槽
	 * @example
	 * '025026' // 至尊魔女 莫甘娜
	 * '103000.2011' // 阿狸（2011旧版）
	 * '498038+497036' // 白星守霞（附加白星守洛的台词）
	 * '497036+498038' // 白星守洛（附加白星守霞的台词）
	 */
	readonly slotFull: string
	/**
	 * 主插槽.副插槽
	 * @example
	 * '498038.2011' <== '498038.2011+497036'
	*/
	readonly slot: string;
	/**
	 * 主插槽
	 * @example
	 * '498038' <== '498038.2011+497036'
	 */
	readonly slotMain?: string;
	/**
	 * 副插槽
	 * @example
	 * '2011' <== '498038.2011+497036'
	 */
	readonly slotSub?: string;
	/**
	 * 附加插槽
	 * @example
	 * ['497036', '497037'] <== '498038.2011+497036+497037'
	 */
	readonly slotsExtra?: string[];
}


/** 台词文件的原始台词配置 */
type DictationLineConfig = {
	/** 音频ID（WWise概念） */
	readonly idAudio?: string;
	/** 声音ID（WWise概念） */
	readonly idsSound?: string[];
	/** 额外配置 */
	readonly extras?: {
		/** 前置台词 */
		readonly before: string[];
		/** 后置台词 */
		readonly after: string[];

		/** 角色 */
		readonly who: string[];
		/** 头像 */
		readonly head: string[];
		/** 目标 */
		readonly target: string[];
		/** 技能图标 */
		readonly skill: string[];

		/** 台词位置 */
		readonly side: string[];

		/** 备注 */
		readonly mark: string[];
		/** 子条件 */
		readonly cond: string[];
		/** 注释（不会用于视频中） */
		readonly comment: string[];
	};

	/** 事件文件 */
	readonly eventsRaw?: string[];
	/** 台词文本 */
	readonly caption?: string;
}

/** 台词配置 */
type LineConfig = {
	/** 原始顺序 */
	readonly order: number;
	/** 最终顺序 */
	readonly orderRanged?: number;


	/** ID集 */
	readonly ids: string[];


	/** 技能文本 */
	readonly event: string;
	/** 台词文本 */
	readonly caption: string;

	/** 备注 */
	readonly mark: string;
	/** 子条件 */
	readonly cond: string;

	/** 音频持续时间 */
	readonly duration: number;
	/** 音频文件 */
	readonly audio: string;
	/** 音频文件名称（匹配用） */
	readonly nameAudio?: string;

	/** 颜色 */
	readonly color: string;
	/** 头像文件 */
	readonly head: string;
	/** 目标文件 */
	readonly target: string;
	/** 技能图标文件 */
	readonly skill: string;

	/** 台词位置 */
	readonly side: 'right' | 'left';

	/** 台词来源，如果为空则表明来自主台词文件 */
	readonly from?: string;
}



/** 最终视频配置 */
type FinalProjectInfo = ResourcePathConfig & VideoConfig & {
	/** 简单工程（用于快速生成工程） */
	readonly simple: boolean;
	/** 不添加音频文件（用于快速生成工程） */
	readonly mute: boolean;


	/** 主标题 */
	readonly title1: string;
	/** 副标题 */
	readonly title2: string;
	/** 副标题后缀 */
	readonly title2Suffix: string;
	/** 片尾文本 */
	readonly textEnding: string;
	/** 合成标题 */
	readonly titleComp: string;


	/** 颜色集（用于全局颜色变量） */
	readonly colorsLine: string[];


	/** 片头原画素材 */
	readonly infosSplashOpener: {
		readonly file: string;
		readonly offset: number;
	}[];

	/** 预处理好的台词 */
	readonly lines: LineConfig[];


	/** 全局注释 */
	readonly marksGlobal: GlobalMarkConfig[];
}

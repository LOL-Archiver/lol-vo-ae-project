const formatCondition = (params) => {
	let result = '';
	let used = 0;

	const use = (value) => 'string' == typeof value ? used++ : null;

	const type = params.shift();

	if(!type || type == '') { return result; }

	const [main] = params;

	// 技能
	if(/^[QWERP]/.test(type)) {
		const [timing] = params;

		result += `【${type}】`;

		if(timing) {
			result += `${timing}`;
		}

		use(timing);
	}
	// 攻击特效
	else if('特效' == type) {
		if(main) {
			result += `附带【${main}】`;
		}
		else {
			throw new Error('缺少特效内容');
		}

		use(main);
	}
	// 条件前置
	else if(['移动'].includes(type)) {
		if(main) {
			result += main;
		}

		use(main);

		result += type;
	}
	// 回应
	else if('回应' == type) {
		const [, ...paramsSub] = params;

		if(paramsSub.length) {
			result += `回应${formatCondition(paramsSub)}的【${main}】`;

			used += params.length;
		}
		else {
			result += `回应【${main}】`;

			used++;
		}

		use(main);
	}
	// 行为Only
	else if([
		'选用', '禁用',
		'初遇', '遇见', '攻击', '击杀', '抢先击杀', '摧毁', '治疗', '阵亡', '重生', '助攻', '占据',
		'普攻', '暴击', '使用', '进化', '学习', '升级', '初次升级', '触发', '冷却', '等级提升', '升级技能',
		'打开', '关闭', '浏览',
		'接近', '抵达', '购买', '附近', '远处', '变身',
		'玩笑', '嘲讽', '跳舞', '大笑', '静置', '回城',
		'自己', '友方', '敌方', '玩家',
	].includes(type)) {
		result += type;
	}
	// 行为+是
	else if(['目标'].includes(type)) {
		result += `${type}是`;
	}
	// 内容可选+大括号
	else if([
		'英雄', '非英雄', '皮肤', '生物', '野怪', '建筑', '植物', '小兵',
		'武器', '道具', '女性', '男性', '多杀', '首杀', '连杀', '团灭', '控制', '商店',
	].includes(type)) {
		if(['连杀'].includes(type)) {
			result += `${type}【${main}】`;
		}
		else if(main) {
			result += `【${main}】`;
		}
		else {
			result += `【${type}】`;
		}

		use(main);
	}
	// 内容必要
	else if(['系列', '地区', '种族', '特征', '造型', '动作', '被', '血量', '备注', '注释', '标题', '对局', '信号', '获得', '数量', '野怪营地'].includes(type)) {
		if(!main) { throw new Error('缺少内容'); }

		use(main);

		// 系列皮肤
		if(['系列'].includes(type)) {
			result += `【${main}】系列皮肤`;
		}
		// 系列皮肤
		else if(['造型'].includes(type)) {
			result += `【${main}】造型英雄`;
		}
		// 地区
		else if(['地区'].includes(type)) {
			result += `【${main}】地区英雄`;
		}
		// 种族
		else if(['种族'].includes(type)) {
			result += `【${main}】英雄`;
		}
		// 信号
		else if(['信号'].includes(type)) {
			result += `发出【${main}】信号`;
		}
		// 的
		else if(['特征'].includes(type)) {
			result += `【${main}】的英雄`;
		}
		// 时
		else if(['动作'].includes(type)) {
			result += `在${main}时`;
		}
		// 时2
		else if(['野怪营地'].includes(type)) {
			result += `【${type}】${main}`;
		}
		// 时3
		else if(['被', '获得', '对局'].includes(type)) {
			if(params[1]) {
				result += `${type}${formatCondition(params.slice(1))}${main}时`;

				params.slice(1).forEach(param => use(param));
			}
			else {
				result += `${type}${main}时`;
			}
		}
		// 行为+内容+时
		else if(['血量'].includes(type)) {
			result += `${type}${main}时`;
		}
		// 内容+括号
		else if(['注释'].includes(type)) {
			result += `（${main}）`;
		}
		// 内容+括号
		else if(['标题'].includes(type)) {
			result += `${main}`;
		}
		// 数量
		else if(['数量'].includes(type)) {
			result += `第${main}次`;
		}
	}
	else if(['条件'].includes(type)) {
		used += params.length;
		result += `（${formatCondition(params)}）`;
	}
	else {
		throw new Error(`未知~[类型]~{${type}} 参数~{${params.join()}}`);
	}

	params.splice(0, used);

	return params.length ? `${result}${formatCondition(params)}` : result;
};

const formatEvent = eventRaw =>
	eventRaw.replace(/(^\[|\]$)/g, '').split('][').map((cond) => formatCondition(cond.split(':'))).join('+');


export default formatEvent;

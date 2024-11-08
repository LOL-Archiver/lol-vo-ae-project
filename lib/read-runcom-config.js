import { resolve as resolvePath } from 'path';

import { readJSONSync } from 'fs-extra/esm';

import { dirProject } from './global.js';



/**
 * @param {string} rawRuncom
 * @param {RuncomConfig} configRuncom
 * @returns {RuncomConfig}
 */
export const parseRuncom = (rawRuncom, configRuncom = {}) => {
	[rawRuncom] = rawRuncom.split('//');
	[configRuncom.mode, configRuncom.slotFull] = rawRuncom.trim().split(':');
	[configRuncom.slot, ...configRuncom.slotsExtra] = configRuncom.slotFull.split('+');

	// 英雄或皮肤
	if(configRuncom.mode == 'cs') {
		[configRuncom.slotMain, configRuncom.slotSub = ''] = configRuncom.slot.split('.');
	}
	// 特别
	else if(configRuncom.mode == 'sp') {
		let partsSlot;
		[configRuncom.slotSpecial, ...partsSlot] = configRuncom.slot.split('-');

		configRuncom.slot = partsSlot.join('-');
	}


	return configRuncom;
};


/** @returns {RuncomConfig} */
export const readRuncomConfig = () => {
	/** @type {RuncomConfig} */
	const configRuncom = {};


	configRuncom.runcoms = readJSONSync(resolvePath(dirProject, 'config.runcom.json')).filter(raw => !raw.startsWith('-'));


	return parseRuncom(configRuncom.runcoms[0], configRuncom);
};

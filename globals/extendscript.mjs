import globalsSharedJavaScript from './adobe/shared/java-script.mjs';
import globalsSharedPlugPlugExternalObject from './adobe/shared/plug-plug-external-object.mjs';
import globalsSharedXMPScript from './adobe/shared/xmp-script.mjs';
import globalsSharedScriptUI from './adobe/shared/script-ui.mjs';
import globalsSharedGlobal from './adobe/shared/global.mjs';

import globalsAfterEffects from './adobe/after-effects-v22.0.mjs';



let globalsCustom = {};
try {
	globalsCustom = (await import('./extendscript-custom.mjs')).default;
}
catch { void 0; }


export default {
	...globalsSharedJavaScript,
	...globalsSharedPlugPlugExternalObject,
	...globalsSharedXMPScript,
	...globalsSharedScriptUI,
	...globalsSharedGlobal,

	...globalsAfterEffects,

	...globalsCustom,
};

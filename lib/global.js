import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';



process.title = 'lol-vo-aeproject-autogen';
// eslint-disable-next-line no-debugger
process.on('unhandledRejection', (error, promise) => { (console ?? {})?.error(error); debugger; });


export const dirProject = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const dirReso = resolve(dirProject, 'reso');
export const dirDistExtend = resolve(dirProject, 'dist-extend');

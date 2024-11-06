/**
 * @param {Array} arrayA
 * @param {Array} arrayB
 * @returns {Array}
 */
export function intersect(arrayA, arrayB) {
	return arrayA.filter(value => arrayB.includes(value));
}


/**
 * @param {Array} arrayA
 * @param {Array} arrayB
 * @returns {boolean}
 */
export function intersected(arrayA, arrayB) {
	return arrayA.filter(value => arrayB.includes(value)).length > 0;
}

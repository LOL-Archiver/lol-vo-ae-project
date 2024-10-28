/**
 * 导入并缓存素材
 * @param {string} path 素材路径
 * @param {FolderItem} parent 父项目
 * @returns {_ItemClasses} 素材
 */
const getFootage = (path, parent) => {
	/** @type {_ItemClasses} */
	let footage = this.GetFootage.map[path];

	if(footage) { return footage; }

	try {
		footage = app.project.importFile(new ImportOptions(new File(path)));
	}
	catch(error) {
		$.writeln(error.message || error);

		throw error;
	}

	if(parent) {
		footage.parentFolder = parent;
	}

	return this.GetFootage.map[path] = footage;
};
this.GetFootage = getFootage;


this.GetFootage.map = {};

// 移除所有内容
Each(app.project, function(item) {
	try {
		if(/^test-/.test(item?.name)) { return; }

		$.writeln(`移除项目: ${item?.name}`);

		item?.remove?.();
	}
	catch(error) {
		$.writeln(error.message || error);
	}
});

app.executeCommand(2373);

this.DirLine = EnsureDir('01-台词', app.project);
this.DirVoice = EnsureDir('02-音频', app.project);
this.DirFootage = EnsureDir('03-素材', app.project);
this.DirComp = EnsureDir('04-合成', app.project);

this.CompMain = EnsureComp(I.titleComp ?? '主合成', 1, app.project);
this.CompTest = EnsureComp('测试合成', 1, app.project);

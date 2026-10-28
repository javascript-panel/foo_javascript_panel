const items = fb.GetLibraryItems();
items.SortByRelativePath();

let out = [];

for (let a = 0; a < items.Count; a++) {
	const obj = {};
	const f = items.GetItem(a).GetFileInfo();

	for (let i = 0; i < f.MetaCount; i++) {
		const name = f.MetaName(i).toUpperCase();
		obj[name] = [];
		const num = f.MetaValueCount(i);

		for (let j = 0; j < num; j++) {
			obj[name].push(f.MetaValue(i, j));
		}
	}

	out.push(obj);
}

utils.ShowPopupMessage(JSON.stringify(out, null, 4));

function on_mouse_lbtn_dblclk() {
	const items = plman.GetPlaylistItems(plman.ActivePlaylist);
	const arr = [];

	for (let i = 0; i < items.Count; i++) {
		const obj = {
			"tracknumber" : i + 1,
			"genre" : ["Rock      ", "    ", "    Hard Rock"],
		};
		arr.push(obj);
	}

	const str = JSON.stringify(arr);
	items.UpdateFileInfoFromJSON(str);
}

function on_mouse_mbtn_up() {
	const items = plman.GetPlaylistItems(plman.ActivePlaylist);
	const obj = {
		"tracknumber" : "    ",
		"genre" : ["   ", "    oh    ", "     noes"],
		"float" : 0.02,
	};

	const str = JSON.stringify(obj);
	items.UpdateFileInfoFromJSON(str);
}

'use strict';

const item = fb.GetFocusItem();
const items = fb.GetLibraryItems();
items.SortByPath();

if (item) {
	console.log("find", items.Find(item));
	const f = item.GetFileInfo();
	console.log("meta find", f.MetaFind("plop"));
	console.log("info find", f.InfoFind("plop"));
}

console.log("autoplaylist", plman.CreateAutoPlaylist(0, "test", "PRESENT ALL"));
console.log("find playlist", plman.FindPlaylist("plop"));
console.log("focus item index", plman.GetPlaylistFocusItemIndex(-1));
console.log("playlist lock filter mask", plman.GetPlaylistLockFilterMask(-1));
console.log("playing playlist", plman.PlayingPlaylist);
console.log("active playlist", plman.ActivePlaylist);

function on_playback_new_track(handle) {
	console.log("on_playback_new_track", handle.Path);
}

function on_playback_edited(handle) {
	console.log("on_playback_edited", handle.Path);
}

function on_item_played(handle) {
	console.log("on_item_played", handle.Path);
}

function on_library_items_added(handles) {
	console.log("on_library_items_added", handles.Count);
}

function on_library_items_removed(handles) {
	console.log("on_library_items_removed", handles.Count);
}

function on_library_items_changed(handles, fromhook) {
	console.log("on_library_items_changed", handles.Count, fromhook);
}

function on_metadb_changed(handles, fromhook) {
	console.log("on_metadb_changed", handles.Count, fromhook);
}

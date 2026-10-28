'use strict';

include('helpers');

const now = utils.Now();
const str = utils.TimestampToDateString(now);
console.log(now, str);
console.log('now == utils.DateStringToTimestamp(str)', now == utils.DateStringToTimestamp(str));

function on_mouse_lbtn_dblclk() {
	const handle = fb.GetFocusItem();

	if (!handle)
		return;

	const path = handle.Path;
	const size = handle.FileSize;
	const size2 = utils.GetFileSize(path);
	console.log('size == size2', size == size2);
	console.log('size * 2 == size2 + size2', size * 2 == size2 + size2);
	console.log(utils.FormatFileSize(size));

	const items = fb.CreateHandleList(handle);
	items.AddItem(handle);
	console.log('items.Count == 2', items.Count == 2);
	console.log('items.CalcTotalDuration() == handle.Length * 2', items.CalcTotalDuration() == handle.Length * 2);
	console.log('items.CalcTotalSize() == size', items.CalcTotalSize() == size);
}

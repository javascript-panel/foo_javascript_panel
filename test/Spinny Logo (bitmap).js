'use strict';

include('helpers');

let ww = 0, wh = 0, angle = 0;
const path = fb.ComponentPath + "samples\\images\\foobar2000.png";
const bitmap = utils.LoadBitmap(path);

window.SetInterval(function () {
	if (!playback.IsPlaying || playback.IsPaused)
		return;

	angle += 10;
	window.Repaint();
}, 10);

function on_colours_changed() {
	window.Repaint();
}

function on_paint(gr) {
	const bg = window.GetUIColour(1);
	gr.Clear(bg);

	if (bitmap) {
		const scale_w = ww / bitmap.Width;
		const scale_h = wh / bitmap.Height;
		const scale = Math.min(scale_w, scale_h);
		let pos_x = 0, pos_y = 0;

		if (scale_w < scale_h)
			pos_y = (wh - bitmap.Height * scale) / 2;
		else if (scale_w > scale_h)
			pos_x = (ww - bitmap.Width * scale) / 2;

		gr.DrawBitmap(bitmap, pos_x, pos_y, bitmap.Width * scale, bitmap.Height * scale, 0, 0, bitmap.Width, bitmap.Height, 1, angle);
	}
}

function on_size() {
	ww = window.Width;
	wh = window.Height;
}

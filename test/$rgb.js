'use strict';
include('helpers');

const default_font = CreateFontString('Segoe UI', 20);
const default_colour = RGB(0, 0, 0);
const tfo = fb.TitleFormat('$rgb(255,0,0)%artist% $rgb(0,255,0)%title%');
let str = '';

refresh();

function refresh() {
	str = fb.GetFocusItem()?.FormatTitle(tfo) || '';
}

function on_item_focus_change() {
	refresh();
	window.Repaint();
}

function on_playlist_switch() {
	refresh();
	window.Repaint();
}

function on_paint(gr) {
	gr.Clear(RGB(255, 255, 255));
	gr.WriteText(str, default_font, default_colour, 0, 0, window.Width, window.Height, 2, 2, 2);
}

'use strict';

include('helpers');
include('lodash.min');

let g_text = "";
const g_font = window.GetUIFont(0);
const g_colour = window.GetUIColour(0);
update_text();

function on_output_device_changed() {
	update_text();
	window.Repaint();
}

function update_text() {
	const arr = JSON.parse(playback.GetOutputDevices());

	g_text = _(arr)
		.filter('Active')
		.map(item => item.Name)
		.value();
}

function on_paint(gr) {
	gr.WriteTextSimple(g_text, g_font, g_colour, 0, 0, window.Width, window.Height, 2, 2);
}

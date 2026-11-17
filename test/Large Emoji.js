'use strict';
include('helpers');

const text = "🤪🎵🎙💿📅";
const font = CreateFont('Segoe UI', 128);

function on_paint(gr) {
	gr.WriteTextSimple(text, font, 0, 0, 0, window.Width, window.Height);
}

'use strict';
include('helpers');

const text = "🤪🎵🎙💿📅";
const font = CreateFontString('Segoe UI', 128);

function on_paint(gr) {
	gr.WriteTextSimple(text, font, 0, 0, 0, window.Width, window.Height);
}

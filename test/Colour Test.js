'use strict';
include('helpers');

function on_paint(gr) {
	for (let i = 0; i < 255; i++) {
		gr.FillRectangle(5 * i, 0, 5, 100, RGBA(255, 0, 0, i));
		gr.FillRectangle(5 * i, 100, 5, 100, RGBA(0, 255, 0, i));
		gr.FillRectangle(5 * i, 200, 5, 100, RGBA(0, 0, 255, i));
	}
}

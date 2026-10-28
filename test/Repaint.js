'use strict';

include('helpers');

let colour = RGB(0, 0, 0);

function on_paint(gr) {
	gr.Clear(colour);
}

window.SetInterval(function () {
	colour = RGB(Math.random() * 255, Math.random() * 255, Math.random() * 255);
	window.RepaintRect(Math.random() * (window.Width - 50), Math.random() * (window.Height - 50), 50, 50);
}, 250);

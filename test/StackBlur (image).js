'use strict';

include('helpers');

const img = utils.LoadImage(fb.ComponentPath + 'test\\images\\1.webp');
let blur_img = null;
let radius = 20;

StackBlur(radius);

function StackBlur(radius) {
	blur_img = img.Clone();
	blur_img.StackBlur(radius);
}

function on_paint(gr) {
	gr.DrawImage(img, 0, 0, 550, 368, 0, 0, 550, 368);
	gr.DrawImage(blur_img, 0, 368, 550, 368, 0, 0, 550, 368);
	gr.FillRectangle(0, 0, window.Width, 24, RGB(0, 0, 0));
	gr.WriteTextSimple('Scroll mouse to change radius: ' + radius, '', RGB(255, 255, 255), 0, 0, window.Width, 24, 2, 0);
}

function on_mouse_wheel(step) {
	radius += step * 5;

	if (radius < 2)
		radius = 2;
	else if (radius > 254)
		radius = 254;

	StackBlur(radius);
	window.Repaint();
}

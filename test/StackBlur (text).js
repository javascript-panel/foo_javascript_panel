'use strict';

include('helpers');

const font = CreateFontString("Segoe UI", 24, true);
const text_to_draw = 'StackBlur Sample';

const size = 400;
const img_to_blur = utils.CreateImage(size, size);

const g = img_to_blur.GetGraphics();
g.WriteTextSimple(text_to_draw, font, RGB(0, 0, 255), 0, 0, size, size, 2, 2);
img_to_blur.ReleaseGraphics();
img_to_blur.StackBlur(30);

function on_paint(gr) {
	gr.Clear(RGB(255, 255, 255));

	const x = (window.Width - size) / 2;
	const y = (window.Height - size) / 2
	gr.DrawImage(img_to_blur, x, y, size, size, 0, 0, size, size);
	gr.WriteTextSimple(text_to_draw, font, RGB(0, 0, 255), x, y, size, size, 2, 2);
}

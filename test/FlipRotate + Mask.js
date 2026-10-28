'use strict';

include('helpers');

const img = utils.LoadImage(fb.ComponentPath + 'test\\images\\1.webp');
const copy = img.Clone();
copy.FlipRotate(WICBitmapTransformFlipVertical);

const mask = utils.CreateImage(img.Width, img.Height);
let temp_gr = mask.GetGraphics();

// FillGradientRectangle is a simplified 2 colour helper method in helpers.js
FillGradientRectangle(temp_gr, 0, 0, img.Width, img.Height, 0, RGBA(0, 0, 0, 150), RGBA(0, 0, 0, 0))
mask.ReleaseGraphics();
temp_gr = null;

function on_paint(gr) {
	gr.Clear(RGB(255, 255, 255));
	gr.DrawImage(img, 0, 0, img.Width, img.Height, 0, 0, img.Width, img.Height);
	gr.DrawImageWithMask(copy, mask, 0, copy.Height, copy.Width, copy.Height);
}

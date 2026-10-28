'use strict';

include('helpers');

/*
Because the DrawImageWithMask method does not support src co-ords,
this sample makes the original image square first which is more
suitable for a circular mask. Also included is a text mask example.

Unlike the previous ApplyMask, there should be no white background.
Just draw black for where you want to keep.

Mask images don't have to have the same width/height.
*/

let temp_gr;

const circular_mask = utils.CreateImage(512, 512);
temp_gr = circular_mask.GetGraphics();
temp_gr.FillEllipse(256, 256, 256, 256, RGB(0, 0, 0));
circular_mask.ReleaseGraphics();
temp_gr = null;

const text_mask = utils.CreateImage(512, 512);
temp_gr = text_mask.GetGraphics();
temp_gr.DrawRectangle(0, 0, 512, 512, 10, RGB(0, 0, 0));
temp_gr.WriteTextSimple('MASK', JSON.stringify({Size:160,Weight:900}), RGB(0, 0, 0), 0, 0, 512, 512, 2, 2);
text_mask.ReleaseGraphics();
temp_gr = null;

const img = utils.LoadImage(fb.ComponentPath + 'test\\images\\1.webp');
const square = make_square(img, 300);

function make_square(img, size) {
	if (!img)
		return null;

	let src_x, src_y, src_w, src_h;

	if (img.Width < img.Height) {
		src_x = 0;
		src_w = img.Width;
		src_h = img.Width;
		src_y = Math.round((img.Height - src_h) / 4);
	} else {
		src_y = 0;
		src_w = img.Height;
		src_h = img.Height;
		src_x = Math.round((img.Width - src_w) / 2);
	}

	const square = utils.CreateImage(size, size);
	temp_gr = square.GetGraphics();
	temp_gr.DrawImage(img, 0, 0, size, size, src_x, src_y, src_w, src_h);
	square.ReleaseGraphics();
	temp_gr = null;
	return square;
}

function on_paint(gr) {
	gr.Clear(RGB(255, 0, 0));
	// original image as-is
	gr.DrawImage(img, 0, 0, img.Width, img.Height, 0, 0, img.Width, img.Height);
	// squared image, no mask
	gr.DrawImage(square, 0, img.Height, square.Width, square.Height, 0, 0, square.Width, square.Height)
	// squared image, circular mask
	gr.DrawImageWithMask(square, circular_mask, 300, img.Height, square.Width, square.Height);
	// squared image, text mask
	gr.DrawImageWithMask(square, text_mask, 600, img.Height, square.Width, square.Height);
}

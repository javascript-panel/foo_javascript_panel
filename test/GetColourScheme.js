'use strict';

include('helpers');

// Tracks playlist selection

const font = ''; // empty string defaults to Segoe UI, 16px
let img;
let colours = [];
on_item_focus_change();

function on_item_focus_change() {
	const metadb = fb.GetFocusItem();
	img = metadb?.GetAlbumArt();
	colours = img?.GetColourScheme() || [];
	window.Repaint();
}

function on_paint(gr) {
	if (img && colours.length) {
		gr.DrawImage(img, 0, 0, 300, 300, 0, 0, img.Width, img.Height);

		colours.forEach((colour, i) => {
			gr.FillRectangle(300, i * 30, window.Width - 300, 30, colour);

			/*
			See helpers.js in the component directory for the DetermineTextColour function
			which calculates whether to use black or white for the text colour depending on
			the background colour.
			*/
			gr.WriteTextSimple('Some text', font, DetermineTextColour(colour), 300, i * 30, window.Width - 300, 30, 2, 2);
		});
	}
}

function on_playlist_switch() {
	on_item_focus_change();
}

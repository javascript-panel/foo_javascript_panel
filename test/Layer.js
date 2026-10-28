'use strict';
include('helpers');

const CreateFontString2 = (name, size, weight) => {
	return JSON.stringify({
		Name : name,
		Size : Math.round(size * DPI / 72),
		Weight : weight || 400
	});
}

const font1 = CreateFontString2("Segoe UI", 24, 700);
const font2 = CreateFontString2("Segoe UI", 24, 700);

let mouse_x = 100;
let mouse_y = 100;

const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

// split text in to whole words for colouring
const words = text.split(' ');

const colours = [];
let start = 0;
words.forEach((word, i) => {
	// length of word plus following space
	const len = word.length + 1;

	colours.push({
		// when using an array, Start and Length are mandatory
		Start : start,
		Length : len,
		Colour : RGB(Math.random() * 200, Math.random() * 200, Math.random() * 200),
	});

	// increment start position for next word
	start += len;
});

const colour_string = JSON.stringify(colours);

function on_paint(gr) {
	gr.Clear(RGB(255, 255, 255));

	// black text
	gr.WriteText(text, font1, RGB(0, 0, 0), 10, 10, window.Width - 20, window.Height - 20);

	// same text coloured, constrained with small square which tracks mouse
	// draw rectangle outline
	gr.DrawRectangle(mouse_x - 100, mouse_y - 100, 200, 200, 1, RGB(255, 0, 0));

	// create layer
	gr.PushLayer(mouse_x - 100, mouse_y - 100, 200, 200);

	// exact x,y,w,h values as black text but see the "layer" in effect on mouse move
	gr.WriteText(text, font2, colour_string, 10, 10, window.Width - 20, window.Height - 20);
	gr.PopLayer();
}

function on_mouse_move(x, y) {
	mouse_x = x;
	mouse_y = y;
	window.Repaint();
}

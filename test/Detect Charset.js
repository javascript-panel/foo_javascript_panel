'use strict';

include('helpers');
include('panel');

const panel = new Panel();
const files = utils.ListFiles(fb.ComponentPath + 'test\\charset\\', true);
const guess = true;

let filename = '';
let text = '';
let i = 0;
let codepage = 0;

update(i);

function update(index) {
	filename = files[index];
	codepage = guess ? utils.DetectCharset(filename) : 0;
	text = utils.ReadTextFile(filename, codepage);
	window.Repaint();
}

function on_mouse_lbtn_dblclk() {
	guess = !guess;
	update(i);
}

function on_mouse_wheel(s) {
	i += s;

	if (i < 0)
		i = files.length - 1;
	else if (i > files.length - 1)
		i = 0;

	update(i);
}

function on_paint(gr) {
	panel.paint(gr);
	panel.draw_header(gr, filename + ' - ' + codepage);
	gr.WriteTextSimple(text, panel.fonts.normal, panel.colours.text, LM, TM, panel.w - (LM * 2), panel.h - TM);
}

function on_size() {
	panel.size();
}

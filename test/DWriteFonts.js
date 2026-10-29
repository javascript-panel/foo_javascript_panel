'use strict';

include('helpers');
include('panel');
include('list_base');

let panel = new Panel();
let list = new ListBase(LM, TM, 0, 0);
list.column_width = 0;

list.paint = function (gr) {
	for (let i = 0; i < Math.min(this.count, this.rows); i++) {
		const name = this.data[i + this.offset].name;
		const y = this.y + Scale(12) + (i * panel.row_height);

		gr.WriteTextSimple(name, panel.fonts.normal, panel.colours.text,
			this.x, y, this.column_width - 20, panel.row_height,
			DWRITE_TEXT_ALIGNMENT_LEADING, DWRITE_PARAGRAPH_ALIGNMENT_CENTER, DWRITE_WORD_WRAPPING_NO_WRAP, DWRITE_TRIMMING_GRANULARITY_CHARACTER);

		gr.WriteTextSimple(name, CreateFontString(name, panel.fonts.size.value), panel.colours.text,
			this.x + this.column_width, y, this.column_width + 20, panel.row_height,
			DWRITE_TEXT_ALIGNMENT_LEADING, DWRITE_PARAGRAPH_ALIGNMENT_CENTER, DWRITE_WORD_WRAPPING_NO_WRAP, DWRITE_TRIMMING_GRANULARITY_CHARACTER)
	}

	this.up_btn.paint(gr, panel.colours.text);
	this.down_btn.paint(gr, panel.colours.text);
}

list.update = function () {
	this.data = [];
	let fonts = utils.ListFonts();

	_.forEach(fonts, (name) => {
		this.data.push({
			name : name
		});
	});

	this.count = this.data.length;
}

list.update();

function on_colours_changed() {
	panel.colours_changed();
	window.Repaint();
}

function on_font_changed() {
	list.update();
	panel.font_changed();
	window.Repaint();
}

function on_mouse_move(x, y) {
	list.move(x, y);
}

function on_mouse_lbtn_up(x, y) {
	list.lbtn_up(x, y);
}

function on_mouse_rbtn_up(x, y) {
	return panel.rbtn_up(x, y);
}

function on_mouse_wheel(s) {
	list.wheel(s);
}

function on_paint(gr) {
	panel.paint(gr);
	panel.draw_header(gr, 'Name');
	gr.WriteTextSimple('WriteText', panel.fonts.title, panel.colours.highlight, LM + list.column_width, 0, list.column_width, TM, DWRITE_TEXT_ALIGNMENT_LEADING, DWRITE_PARAGRAPH_ALIGNMENT_CENTER, DWRITE_WORD_WRAPPING_NO_WRAP);
	list.paint(gr);
}

function on_size() {
	panel.size();
	list.w = panel.w - (TM * 2);
	list.h = panel.h - TM;
	list.size();
	list.column_width = list.w / 2;
}

'use strict';
include('helpers');
include('panel');
include('list_base');

const panel = new Panel();
const list = new ListBase(LM, TM, 0, 0);
const flag_font = CreateFontString("Noto Color Emoji", 12);
const json = _(JsonParseFile("Z:\\Git\\javascript-panel\\src\\Resource\\countries.json"))
	.sortBy("name")
	.value();

list.paint = function (gr) {
	for (let i = 0; i < Math.min(this.count, this.rows); i++) {
		const obj = this.data[i + this.offset];
		const y = this.y + Scale(12) + (i * panel.row_height);

		gr.WriteTextSimple(obj.flag, flag_font, panel.colours.text,
			this.x, y, 32, panel.row_height,
			DWRITE_TEXT_ALIGNMENT_CENTER, DWRITE_PARAGRAPH_ALIGNMENT_CENTER, DWRITE_WORD_WRAPPING_NO_WRAP, DWRITE_TRIMMING_GRANULARITY_CHARACTER);
			
		gr.WriteTextSimple(obj.name, panel.fonts.normal, panel.colours.text,
			this.x + 32, y, this.w, panel.row_height,
			DWRITE_TEXT_ALIGNMENT_LEADING, DWRITE_PARAGRAPH_ALIGNMENT_CENTER, DWRITE_WORD_WRAPPING_NO_WRAP, DWRITE_TRIMMING_GRANULARITY_CHARACTER)
	}

	this.up_btn.paint(gr, panel.colours.text);
	this.down_btn.paint(gr, panel.colours.text);
}

list.update = function () {
	this.data = [];
	let str = '';

	_.forEach(json, (item, i) => {
		this.data.push({
			flag : item.flag,
			name : item.name
		});
		
		str += item.flag + ' ' + item.name + '\r\n';
	});

	//utils.ShowPopupMessage(str)
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
	panel.draw_header(gr, 'Country');
	list.paint(gr);
}

function on_size() {
	panel.size();
	list.w = panel.w - (TM * 2);
	list.h = panel.h - TM;
	list.size();
}

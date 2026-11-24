'use strict';

window.DefineScript('ListenBrainz Similar Artists', { author : 'marc2003', features : { grab_focus : true }});
include('helpers');
include('panel');
include('listenbrainz');

let panel = new Panel();
let listenbrainz = new ListenBrainz(LM, TM, 0, 0);

refresh();

function refresh() {
	panel.item_focus_change();
	listenbrainz.refresh();
}

function on_colours_changed() {
	panel.colours_changed();
	window.Repaint();
}

function on_font_changed() {
	panel.font_changed();
	window.Repaint();
}

function on_http_request_done(task_id, success, response_text) {
	listenbrainz.http_request_done(task_id, success, response_text);
}

function on_item_focus_change() {
	if (panel.prefer_playing())
		return;

	refresh();
}

function on_key_down(k) {
	listenbrainz.key_down(k);
}

function on_metadb_changed(handles, fromhook) {
	if (fromhook || !panel.metadb_changed(handles))
		return;

	listenbrainz.refresh();
}

function on_mouse_lbtn_up(x, y) {
	listenbrainz.lbtn_up(x, y);
}

function on_mouse_move(x, y) {
	listenbrainz.move(x, y);
}

function on_mouse_rbtn_up(x, y) {
	return panel.rbtn_up(x, y, listenbrainz);
}

function on_mouse_wheel(s) {
	listenbrainz.wheel(s);
}

function on_notify_data(name, data) {
	lastfm.notify_data(name, data);
}

function on_paint(gr) {
	panel.paint(gr);
	panel.draw_header(gr, listenbrainz.header_text());
	listenbrainz.paint(gr);
}

function on_playback_new_track() {
	refresh();
}

function on_playback_stop(reason) {
	if (reason != 2) {
		refresh();
	}
}

function on_playlist_switch() {
	on_item_focus_change();
}

function on_size() {
	panel.size();
	listenbrainz.w = panel.w - (LM * 2);
	listenbrainz.h = panel.h - TM;
	listenbrainz.size();
}

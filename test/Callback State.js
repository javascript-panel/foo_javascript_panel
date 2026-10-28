'use strict';

window.DefineScript('callback state', { author : 'marc2003', features : { grab_focus : true }});

// watched objects
function on_always_on_top_changed(state) {console.log("on_always_on_top_changed", typeof state, state);}
function on_cursor_follow_playback_changed(state) {console.log("on_cursor_follow_playback_changed", typeof state, state);}
function on_playback_follow_cursor_changed(state) {console.log("on_playback_follow_cursor_changed", typeof state, state);}
function on_playlist_stop_after_current_changed(state) {console.log("on_playlist_stop_after_current_changed", typeof state, state);}

// winapi
function on_focus(is_focused) {console.log("on_focus", typeof is_focused, is_focused);}

// playback callbacks
function on_playback_pause(state) {console.log("on_playback_pause", typeof state, state);}
function on_playback_starting(cmd, is_paused) {console.log("on_playback_starting", cmd, typeof is_paused, is_paused);}
